//using IPLLive.API.Data;
//using IPLLive.API.Data.Repositories;
//using IPLLive.API.DTOs;
//using IPLLive.API.Hubs;
//using IPLLive.API.Models;
//using IPLLive.API.Models.Enums;
//using Microsoft.AspNetCore.SignalR;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace IPLLive.API.Services
//{
//    public class MatchService : IMatchService
//    {
//        private readonly IMatchRepository _matchRepository;
//        private readonly ApplicationDbContext _context;
//        private readonly IHubContext<ScoreHub> _hubContext;

//        public MatchService(ApplicationDbContext context, IMatchRepository matchRepository)
//        {
//            _context = context ?? throw new ArgumentNullException(nameof(context));
//            _matchRepository = matchRepository ?? throw new ArgumentNullException(nameof(matchRepository));
//        }

//        public async Task<IEnumerable<MatchDto>> GetAllMatchesAsync()
//        {
//            var matches = await _matchRepository.GetAllAsync();
//            return matches.Select(MapToDto).ToList();
//        }

//        public async Task<MatchDto> GetMatchByIdAsync(int id)
//        {
//            var match = await _matchRepository.GetMatchWithDetailsAsync(id);
//            return match != null ? MapToDto(match) : null;
//        }

//        public async Task<IEnumerable<MatchDto>> GetMatchesByDateAsync(DateTime date)
//        {
//            var matches = await _matchRepository.GetMatchesByDateAsync(date);
//            return matches.Select(MapToDto).ToList();
//        }

//        public async Task<IEnumerable<MatchDto>> GetMatchesByTeamAsync(int teamId)
//        {
//            var matches = await _matchRepository.GetMatchesByTeamAsync(teamId);
//            return matches.Select(MapToDto).ToList();
//        }

//        public async Task<IEnumerable<MatchDto>> GetMatchesBySeasonAsync(int seasonId)
//        {
//            var matches = await _matchRepository.GetMatchesBySeasonAsync(seasonId);
//            return matches.Select(MapToDto).ToList();
//        }

//        public async Task<IEnumerable<MatchDto>> GetUpcomingMatchesAsync(int count)
//        {
//            var currentDate = DateTime.UtcNow;
//            var matches = await _matchRepository.GetMatchesByQueryAsync(
//                m => m.ScheduledDateTime > currentDate && m.Status == MatchStatus.Scheduled,
//                q => q.OrderBy(m => m.ScheduledDateTime).Take(count));

//            return matches.Select(MapToDto).ToList();
//        }

//        public async Task<IEnumerable<MatchDto>> GetRecentMatchesAsync(int count)
//        {
//            var currentDate = DateTime.UtcNow;
//            var matches = await _matchRepository.GetMatchesByQueryAsync(
//                m => m.Status == MatchStatus.Completed,
//                q => q.OrderByDescending(m => m.ScheduledDateTime).Take(count));

//            return matches.Select(MapToDto).ToList();
//        }

//        public async Task<IEnumerable<MatchDto>> GetLiveMatchesAsync()
//        {
//            var matches = await _matchRepository.GetMatchesByQueryAsync(
//                m => m.Status == MatchStatus.InProgress,
//                q => q.OrderBy(m => m.ScheduledDateTime));

//            return matches.Select(MapToDto).ToList();
//        }

//        public async Task<Match> CreateMatchAsync(Match match)
//        {
//            await _matchRepository.AddAsync(match);
//            await _matchRepository.SaveAsync();

//            await _hubContext.Clients.All.SendAsync("MatchAdded", MapToDto(match));

//            return match;
//        }

//        public async Task<Match> UpdateMatchAsync(Match match)
//        {
//            await _matchRepository.UpdateAsync(match);
//            await _matchRepository.SaveAsync();

//            // Notify clients about the updated match
//            await _hubContext.Clients.All.SendAsync("MatchUpdated", MapToDto(match));
//            await _hubContext.Clients.Group($"match_{match.MatchId}").SendAsync("MatchDetailsUpdated", MapToDto(match));

//            return match;
//        }

//        public async Task<bool> DeleteMatchAsync(int id)
//        {
//            var match = await _matchRepository.GetByIdAsync(id);

//            if (match == null)
//                return false;

//            await _matchRepository.DeleteAsync(match);
//            await _matchRepository.SaveAsync();

//            // Notify clients about the deleted match
//            await _hubContext.Clients.All.SendAsync("MatchDeleted", id);

//            return true;
//        }

//        private MatchDto MapToDto(Match match)
//        {
//            var matchDto = new MatchDto
//            {
//                MatchId = match.MatchId,
//                SeasonId = match.SeasonId,
//                SeasonName = match.Season?.Name,
//                HomeTeamId = match.HomeTeamId,
//                HomeTeamName = match.HomeTeam?.Name,
//                HomeTeamLogo = match.HomeTeam?.LogoUrl,
//                AwayTeamId = match.AwayTeamId,
//                AwayTeamName = match.AwayTeam?.Name,
//                AwayTeamLogo = match.AwayTeam?.LogoUrl,
//                VenueId = match.VenueId,
//                VenueName = match.Venue?.Name,
//                ScheduledDateTime = match.ScheduledDateTime,
//                Status = match.Status,
//                WinnerTeamId = match.WinnerTeamId,
//                WinnerTeamName = match.WinnerTeam?.Name,
//                WinMargin = match.WinMargin,
//                TossWinner = match.TossWinnerTeam?.Name,
//                TossDecision = match.TossDecision
//            };

//            // Map innings if they are loaded
//            if (match.Innings != null)
//            {
//                matchDto.Innings = match.Innings.Select(i => new InningsDto
//                {
//                    InningsId = i.InningsId,
//                    MatchId = i.MatchId,
//                    BattingTeamId = i.BattingTeamId,
//                    BattingTeamName = i.BattingTeam?.Name,
//                    BowlingTeamId = i.BowlingTeamId,
//                    BowlingTeamName = i.BowlingTeam?.Name,
//                    InningsNumber = i.InningsNumber,
//                    Runs = i.Runs,
//                    Wickets = i.Wickets,
//                    Overs = i.Overs,
//                    Extras = i.Extras,
//                    Wides = i.Wides,
//                    NoBalls = i.NoBalls,
//                    Byes = i.Byes,
//                    LegByes = i.LegByes,
//                    PenaltyRuns = i.PenaltyRuns,
//                    IsCompleted = i.IsCompleted
//                }).ToList();
//            }

//            return matchDto;
//        }
//    }
//}
using IPLLive.API.Data;
using IPLLive.API.Data.Repositories;
using IPLLive.API.DTOs;
using IPLLive.API.Models;
using IPLLive.API.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public class MatchService : IMatchService
    {
        private readonly IMatchRepository _matchRepository;
        private readonly ApplicationDbContext _context;

        public MatchService(ApplicationDbContext context, IMatchRepository matchRepository)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _matchRepository = matchRepository ?? throw new ArgumentNullException(nameof(matchRepository));
        }

        public async Task<IEnumerable<MatchDto>> GetAllMatchesAsync()
        {
            var matches = await _matchRepository.GetAllAsync();
            return matches.Select(MapToDto).ToList();
        }

        public async Task<MatchDto> GetMatchByIdAsync(int id)
        {
            var match = await _matchRepository.GetMatchWithDetailsAsync(id);
            return match != null ? MapToDto(match) : null;
        }

        public async Task<IEnumerable<MatchDto>> GetMatchesByDateAsync(DateTime date)
        {
            var matches = await _matchRepository.GetMatchesByDateAsync(date);
            return matches.Select(MapToDto).ToList();
        }

        public async Task<IEnumerable<MatchDto>> GetMatchesByTeamAsync(int teamId)
        {
            var matches = await _matchRepository.GetMatchesByTeamAsync(teamId);
            return matches.Select(MapToDto).ToList();
        }

        public async Task<IEnumerable<MatchDto>> GetMatchesBySeasonAsync(int seasonId)
        {
            var matches = await _matchRepository.GetMatchesBySeasonAsync(seasonId);
            return matches.Select(MapToDto).ToList();
        }

        public async Task<IEnumerable<MatchDto>> GetUpcomingMatchesAsync(int count)
        {
            var currentDate = DateTime.UtcNow;
            var matches = await _matchRepository.GetMatchesByQueryAsync(
                m => m.ScheduledDateTime > currentDate && m.Status == MatchStatus.Scheduled,
                q => q.OrderBy(m => m.ScheduledDateTime).Take(count));

            return matches.Select(MapToDto).ToList();
        }

        public async Task<IEnumerable<MatchDto>> GetRecentMatchesAsync(int count)
        {
            var currentDate = DateTime.UtcNow;
            var matches = await _matchRepository.GetMatchesByQueryAsync(
                m => m.Status == MatchStatus.Completed,
                q => q.OrderByDescending(m => m.ScheduledDateTime).Take(count));

            return matches.Select(MapToDto).ToList();
        }

        public async Task<IEnumerable<MatchDto>> GetLiveMatchesAsync()
        {
            var matches = await _matchRepository.GetMatchesByQueryAsync(
                m => m.Status == MatchStatus.InProgress,
                q => q.OrderBy(m => m.ScheduledDateTime));

            return matches.Select(MapToDto).ToList();
        }

        public async Task<Match> CreateMatchAsync(Match match)
        {
            await _matchRepository.AddAsync(match);
            await _matchRepository.SaveAsync();

            // Removed _hubContext call since ScoreHub is not intended
            return match;
        }

        public async Task<Match> UpdateMatchAsync(Match match)
        {
            await _matchRepository.UpdateAsync(match);
            await _matchRepository.SaveAsync();

            // Removed _hubContext calls since ScoreHub is not intended
            return match;
        }

        public async Task<bool> DeleteMatchAsync(int id)
        {
            var match = await _matchRepository.GetByIdAsync(id);

            if (match == null)
                return false;

            await _matchRepository.DeleteAsync(match);
            await _matchRepository.SaveAsync();

            // Removed _hubContext call since ScoreHub is not intended
            return true;
        }

        private MatchDto MapToDto(Match match)
        {
            var matchDto = new MatchDto
            {
                MatchId = match.MatchId,
                SeasonId = match.SeasonId,
                SeasonName = match.Season?.Name,
                HomeTeamId = match.HomeTeamId,
                HomeTeamName = match.HomeTeam?.Name,
                HomeTeamLogo = match.HomeTeam?.LogoUrl,
                AwayTeamId = match.AwayTeamId,
                AwayTeamName = match.AwayTeam?.Name,
                AwayTeamLogo = match.AwayTeam?.LogoUrl,
                VenueId = match.VenueId,
                VenueName = match.Venue?.Name,
                ScheduledDateTime = match.ScheduledDateTime,
                Status = match.Status,
                WinnerTeamId = match.WinnerTeamId,
                WinnerTeamName = match.WinnerTeam?.Name,
                WinMargin = match.WinMargin,
                TossWinner = match.TossWinnerTeam?.Name,
                TossDecision = match.TossDecision
            };

            // Map innings if they are loaded
            if (match.Innings != null)
            {
                matchDto.Innings = match.Innings.Select(i => new InningsDto
                {
                    InningsId = i.InningsId,
                    MatchId = i.MatchId,
                    BattingTeamId = i.BattingTeamId,
                    BattingTeamName = i.BattingTeam?.Name,
                    BowlingTeamId = i.BowlingTeamId,
                    BowlingTeamName = i.BowlingTeam?.Name,
                    InningsNumber = i.InningsNumber,
                    Runs = i.Runs,
                    Wickets = i.Wickets,
                    Overs = i.Overs,
                    Extras = i.Extras,
                    Wides = i.Wides,
                    NoBalls = i.NoBalls,
                    Byes = i.Byes,
                    LegByes = i.LegByes,
                    PenaltyRuns = i.PenaltyRuns,
                    IsCompleted = i.IsCompleted
                }).ToList();
            }

            return matchDto;
        }
    }
}
