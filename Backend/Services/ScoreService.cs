using IPLLive.API.Data;
using IPLLive.API.Data.Repositories;
using IPLLive.API.DTOs;
using IPLLive.API.Helpers;
using IPLLive.API.Hubs;
using IPLLive.API.Models;
using IPLLive.API.Models.Enums;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public class ScoreService : IScoreService
    {
        private readonly ApplicationDbContext _context;
        private readonly IRepository<Innings> _inningsRepository;
        private readonly IRepository<BattingPerformance> _battingRepository;
        private readonly IRepository<BowlingPerformance> _bowlingRepository;
        private readonly IRepository<BallByBallData> _ballRepository;
        private readonly IMatchRepository _matchRepository;
        private readonly IHubContext<ScoreHub> _hubContext;

        public ScoreService(
            ApplicationDbContext context,
            IRepository<Innings> inningsRepository,
            IRepository<BattingPerformance> battingRepository,
            IRepository<BowlingPerformance> bowlingRepository,
            IRepository<BallByBallData> ballRepository,
            IMatchRepository matchRepository,
            IHubContext<ScoreHub> hubContext)
        {
            _context = context;
            _inningsRepository = inningsRepository;
            _battingRepository = battingRepository;
            _bowlingRepository = bowlingRepository;
            _ballRepository = ballRepository;
            _matchRepository = matchRepository;
            _hubContext = hubContext;
        }

        public async Task<Innings> CreateInningsAsync(Innings innings)
        {
            // Start the match if this is the first innings
            var match = await _matchRepository.GetByIdAsync(innings.MatchId);
            if (match.Status == MatchStatus.Scheduled)
            {
                match.Status = MatchStatus.InProgress;
                await _matchRepository.UpdateAsync(match);
                await _matchRepository.SaveAsync();
            }

            await _inningsRepository.AddAsync(innings);
            await _inningsRepository.SaveAsync();

            // Notify clients
            await _hubContext.Clients.Group($"match_{innings.MatchId}").SendAsync("InningsCreated", MapInningsToDto(innings));

            return innings;
        }

        public async Task<Innings> UpdateInningsAsync(Innings innings)
        {
            await _inningsRepository.UpdateAsync(innings);
            await _inningsRepository.SaveAsync();

            // Notify clients
            await _hubContext.Clients.Group($"match_{innings.MatchId}").SendAsync("InningsUpdated", MapInningsToDto(innings));

            return innings;
        }

        public async Task<BallByBallData> AddBallAsync(BallByBallData ball)
        {
            // Add the ball data
            await _ballRepository.AddAsync(ball);
            await _ballRepository.SaveAsync();

            // Update innings details
            var innings = await _inningsRepository.GetByIdAsync(ball.InningsId);

            // Calculate new overs
            decimal currentOvers = innings.Overs;
            int ballsInCurrentOver = (int)((currentOvers - Math.Floor(currentOvers)) * 10);

            if (ballsInCurrentOver < 5 && !ball.IsExtra)
            {
                // Regular ball in the current over
                innings.Overs = (int)currentOvers + ((ballsInCurrentOver + 1) * 0.1m);
            }
            else if (ballsInCurrentOver == 5 && !ball.IsExtra)
            {
                // End of over
                innings.Overs = (int)currentOvers + 1;
            }
            else if (ball.IsExtra && ball.ExtraType != ExtraType.Wide && ball.ExtraType != ExtraType.NoBall)
            {
                // Extras that count as legal deliveries (byes, leg byes)
                if (ballsInCurrentOver < 5)
                {
                    innings.Overs = (int)currentOvers + ((ballsInCurrentOver + 1) * 0.1m);
                }
                else
                {
                    innings.Overs = (int)currentOvers + 1;
                }
            }

            // Update runs and extras
            innings.Runs += ball.RunsScored;

            if (ball.IsExtra)
            {
                // Since Extras is a calculated property and cannot be assigned directly,
                // we update the individual components instead

                // Update specific extras
                switch (ball.ExtraType)
                {
                    case ExtraType.Wide:
                        innings.Wides += ball.ExtraRuns;
                        break;
                    case ExtraType.NoBall:
                        innings.NoBalls += ball.ExtraRuns;
                        break;
                    case ExtraType.Bye:
                        innings.Byes += ball.ExtraRuns;
                        break;
                    case ExtraType.LegBye:
                        innings.LegByes += ball.ExtraRuns;
                        break;
                    case ExtraType.Penalty:
                        innings.PenaltyRuns += ball.ExtraRuns;
                        break;
                }
            }

            // Update wickets
            if (ball.IsWicket)
            {
                innings.Wickets++;
            }

            await _inningsRepository.UpdateAsync(innings);
            await _inningsRepository.SaveAsync();

            // Update batting performance
            var batsman = await _context.BattingPerformances
                .FirstOrDefaultAsync(bp => bp.InningsId == ball.InningsId && bp.PlayerId == ball.BatsmanId);

            if (batsman != null)
            {
                batsman.Runs += ball.RunsScored;
                batsman.BallsFaced += ball.IsExtra && (ball.ExtraType == ExtraType.Wide) ? 0 : 1;

                if (ball.RunsScored == 4)
                    batsman.Fours++;
                if (ball.RunsScored == 6)
                    batsman.Sixes++;

                if (ball.IsWicket && ball.PlayerOutId == ball.BatsmanId)
                {
                    batsman.IsNotOut = false;
                    batsman.DismissalType = ball.WicketType.ToString();
                    batsman.BowledById = ball.WicketType == WicketType.Bowled || ball.WicketType == WicketType.LBW || ball.WicketType == WicketType.Caught ? ball.BowlerId : null;
                    batsman.CaughtById = ball.WicketType == WicketType.Caught ? ball.FielderId : null;
                }

                await _context.SaveChangesAsync();
            }

            // Update bowling performance
            var bowler = await _context.BowlingPerformances
                .FirstOrDefaultAsync(bp => bp.InningsId == ball.InningsId && bp.PlayerId == ball.BowlerId);

            if (bowler != null)
            {
                if (!ball.IsExtra || (ball.ExtraType != ExtraType.Wide && ball.ExtraType != ExtraType.NoBall))
                {
                    decimal currentBowlerOvers = bowler.Overs;
                    int ballsInCurrentBowlerOver = (int)((currentBowlerOvers - Math.Floor(currentBowlerOvers)) * 10);

                    if (ballsInCurrentBowlerOver < 5)
                    {
                        bowler.Overs = (int)currentBowlerOvers + ((ballsInCurrentBowlerOver + 1) * 0.1m);
                    }
                    else
                    {
                        bowler.Overs = (int)currentBowlerOvers + 1;
                    }
                }

                if (ball.IsExtra)
                {
                    if (ball.ExtraType == ExtraType.Wide)
                        bowler.Wides++;
                    if (ball.ExtraType == ExtraType.NoBall)
                        bowler.NoBalls++;

                    if (ball.ExtraType == ExtraType.Wide || ball.ExtraType == ExtraType.NoBall)
                        bowler.RunsConceded += ball.ExtraRuns;
                }

                bowler.RunsConceded += ball.RunsScored;

                if (ball.IsWicket && (ball.WicketType == WicketType.Bowled || ball.WicketType == WicketType.LBW ||
                                        ball.WicketType == WicketType.Caught || ball.WicketType == WicketType.HitWicket ||
                                        ball.WicketType == WicketType.StumpedOut))
                {
                    bowler.Wickets++;
                }

                await _context.SaveChangesAsync();
            }

            // Map to DTO and notify clients
            var ballDto = new BallByBallDto
            {
                BallId = ball.BallId,
                InningsId = ball.InningsId,
                OverNumber = ball.OverNumber,
                BallNumber = ball.BallNumber,
                BatsmanId = ball.BatsmanId,
                BatsmanName = ball.Batsman?.Name,
                BowlerId = ball.BowlerId,
                BowlerName = ball.Bowler?.Name,
                RunsScored = ball.RunsScored,
                IsExtra = ball.IsExtra,
                ExtraType = ball.ExtraType,
                ExtraRuns = ball.ExtraRuns,
                IsWicket = ball.IsWicket,
                WicketType = ball.WicketType,
                PlayerOutId = ball.PlayerOutId,
                PlayerOutName = ball.PlayerOut?.Name,
                FielderId = ball.FielderId,
                FielderName = ball.Fielder?.Name,
                Commentary = ball.Commentary,
                Timestamp = ball.Timestamp
            };

            // Notify clients
            await _hubContext.Clients.Group($"match_{innings.MatchId}").SendAsync("BallAdded", ballDto);
            await _hubContext.Clients.Group($"match_{innings.MatchId}").SendAsync("InningsUpdated", MapInningsToDto(innings));

            return ball;
        }

        public async Task<BattingPerformance> UpdateBattingPerformanceAsync(BattingPerformance battingPerformance)
        {
            await _battingRepository.UpdateAsync(battingPerformance);
            await _battingRepository.SaveAsync();

            // Get match ID for notifications
            var innings = await _inningsRepository.GetByIdAsync(battingPerformance.InningsId);

            // Map to DTO
            var battingDto = new BattingPerformanceDto
            {
                BattingPerformanceId = battingPerformance.BattingPerformanceId,
                PlayerId = battingPerformance.PlayerId,
                PlayerName = battingPerformance.Player?.Name,
                InningsId = battingPerformance.InningsId,
                Runs = battingPerformance.Runs,
                BallsFaced = battingPerformance.BallsFaced,
                Fours = battingPerformance.Fours,
                Sixes = battingPerformance.Sixes,
                IsNotOut = battingPerformance.IsNotOut,
                DismissalType = battingPerformance.DismissalType,
                BowledById = battingPerformance.BowledById,
                BowledByName = battingPerformance.BowledBy?.Name,
                CaughtById = battingPerformance.CaughtById,
                CaughtByName = battingPerformance.CaughtBy?.Name
            };

            // Notify clients
            await _hubContext.Clients.Group($"match_{innings.MatchId}").SendAsync("BattingPerformanceUpdated", battingDto);

            return battingPerformance;
        }

        public async Task<BowlingPerformance> UpdateBowlingPerformanceAsync(BowlingPerformance bowlingPerformance)
        {
            await _bowlingRepository.UpdateAsync(bowlingPerformance);
            await _bowlingRepository.SaveAsync();

            // Get match ID for notifications
            var innings = await _inningsRepository.GetByIdAsync(bowlingPerformance.InningsId);

            // Map to DTO
            var bowlingDto = new BowlingPerformanceDto
            {
                BowlingPerformanceId = bowlingPerformance.BowlingPerformanceId,
                PlayerId = bowlingPerformance.PlayerId,
                PlayerName = bowlingPerformance.Player?.Name,
                InningsId = bowlingPerformance.InningsId,
                Overs = bowlingPerformance.Overs,
                Maidens = bowlingPerformance.Maidens,
                RunsConceded = bowlingPerformance.RunsConceded,
                Wickets = bowlingPerformance.Wickets,
                Wides = bowlingPerformance.Wides,
                NoBalls = bowlingPerformance.NoBalls
            };

            // Notify clients
            await _hubContext.Clients.Group($"match_{innings.MatchId}").SendAsync("BowlingPerformanceUpdated", bowlingDto);

            return bowlingPerformance;
        }

        public async Task<bool> EndInningsAsync(int inningsId)
        {
            var innings = await _inningsRepository.GetByIdAsync(inningsId);

            if (innings == null)
                return false;

            innings.IsCompleted = true;
            await _inningsRepository.UpdateAsync(innings);
            await _inningsRepository.SaveAsync();

            // Notify clients
            await _hubContext.Clients.Group($"match_{innings.MatchId}").SendAsync("InningsCompleted", MapInningsToDto(innings));

            return true;
        }

        public async Task<bool> EndMatchAsync(int matchId, int? winnerTeamId, string winMargin)
        {
            var match = await _matchRepository.GetByIdAsync(matchId);

            if (match == null)
                return false;

            match.Status = MatchStatus.Completed;
            match.WinnerTeamId = winnerTeamId;
            match.WinMargin = winMargin;

            await _matchRepository.UpdateAsync(match);
            await _matchRepository.SaveAsync();

            // Update points table
            if (winnerTeamId.HasValue)
            {
                await UpdatePointsTable(matchId, winnerTeamId.Value);
            }
            else
            {
                // No result or tie
                await UpdatePointsTableNoResult(matchId);
            }

            // Notify clients
            await _hubContext.Clients.All.SendAsync("MatchCompleted", matchId);

            return true;
        }

        private async Task UpdatePointsTable(int matchId, int winnerTeamId)
        {
            var match = await _context.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .FirstOrDefaultAsync(m => m.MatchId == matchId);

            if (match == null)
                return;

            // Get or create points table entries
            var winnerEntry = await GetOrCreatePointsTableEntry(match.SeasonId, winnerTeamId);
            var loserTeamId = match.HomeTeamId == winnerTeamId ? match.AwayTeamId : match.HomeTeamId;
            var loserEntry = await GetOrCreatePointsTableEntry(match.SeasonId, loserTeamId);

            // Update winner stats
            winnerEntry.MatchesPlayed += 1;
            winnerEntry.Won += 1;
            winnerEntry.Points += 2; // 2 points for a win

            // Update loser stats
            loserEntry.MatchesPlayed += 1;
            loserEntry.Lost += 1;

            // Calculate and update net run rate - simplified version
            // This is a simplified calculation and might need to be adjusted based on specific league rules

            await _context.SaveChangesAsync();
        }

        private async Task UpdatePointsTableNoResult(int matchId)
        {
            var match = await _context.Matches
                .FirstOrDefaultAsync(m => m.MatchId == matchId);

            if (match == null)
                return;

            // Get or create points table entries
            var homeTeamEntry = await GetOrCreatePointsTableEntry(match.SeasonId, match.HomeTeamId);
            var awayTeamEntry = await GetOrCreatePointsTableEntry(match.SeasonId, match.AwayTeamId);

            // Update stats for both teams
            homeTeamEntry.MatchesPlayed += 1;
            awayTeamEntry.MatchesPlayed += 1;

            if (match.WinMargin == "Tied")
            {
                homeTeamEntry.Tied += 1;
                awayTeamEntry.Tied += 1;
                homeTeamEntry.Points += 1; // 1 point for a tie
                awayTeamEntry.Points += 1;
            }
            else
            {
                homeTeamEntry.NoResult += 1;
                awayTeamEntry.NoResult += 1;
                homeTeamEntry.Points += 1; // 1 point for no result
                awayTeamEntry.Points += 1;
            }

            await _context.SaveChangesAsync();
        }

        private async Task<Models.PointsTableEntry> GetOrCreatePointsTableEntry(int seasonId, int teamId)
        {
            var entry = await _context.PointsTableEntries
                .FirstOrDefaultAsync(p => p.SeasonId == seasonId && p.TeamId == teamId);

            if (entry == null)
            {
                entry = new PointsTableEntry
                {
                    SeasonId = seasonId,
                    TeamId = teamId,
                    MatchesPlayed = 0,
                    Won = 0,
                    Lost = 0,
                    Tied = 0,
                    NoResult = 0,
                    Points = 0,
                    NetRunRate = 0
                };

                await _context.PointsTableEntries.AddAsync(entry);
                await _context.SaveChangesAsync();
            }

            return entry;
        }

        private InningsDto MapInningsToDto(Innings innings)
        {
            return new InningsDto
            {
                InningsId = innings.InningsId,
                MatchId = innings.MatchId,
                BattingTeamId = innings.BattingTeamId,
                BattingTeamName = innings.BattingTeam?.Name,
                BowlingTeamId = innings.BowlingTeamId,
                BowlingTeamName = innings.BowlingTeam?.Name,
                InningsNumber = innings.InningsNumber,
                Runs = innings.Runs,
                Wickets = innings.Wickets,
                Overs = innings.Overs,
                Extras = innings.Extras,
                Wides = innings.Wides,
                NoBalls = innings.NoBalls,
                Byes = innings.Byes,
                LegByes = innings.LegByes,
                PenaltyRuns = innings.PenaltyRuns,
                IsCompleted = innings.IsCompleted
            };
        }
    }
}
