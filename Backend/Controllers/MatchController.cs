using IPLLive.API.Data;
using IPLLive.API.Models;
using IPLLive.API.Models.Dtos;
using IPLLive.API.Models.Enums;
using IPLLive.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace IPLLive.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchController : ControllerBase
    {
        private readonly IMatchService _matchService;
        private readonly ApplicationDbContext _context;

        public MatchController(IMatchService matchService, ApplicationDbContext context)
        {
            _matchService = matchService ?? throw new ArgumentNullException(nameof(matchService));
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMatches()
        {
            var matches = await _matchService.GetAllMatchesAsync();
            return Ok(matches);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMatch(int id)
        {
            var match = await _matchService.GetMatchByIdAsync(id);

            if (match == null)
                return NotFound();

            return Ok(match);
        }

        [HttpGet("date/{date}")]
        public async Task<IActionResult> GetMatchesByDate(DateTime date)
        {
            var matches = await _matchService.GetMatchesByDateAsync(date);
            return Ok(matches);
        }

        [HttpGet("team/{teamId}")]
        public async Task<IActionResult> GetMatchesByTeam(int teamId)
        {
            var matches = await _matchService.GetMatchesByTeamAsync(teamId);
            return Ok(matches);
        }

        [HttpGet("season/{seasonId}")]
        public async Task<IActionResult> GetMatchesBySeason(int seasonId)
        {
            var matches = await _matchService.GetMatchesBySeasonAsync(seasonId);
            return Ok(matches);
        }

        [HttpGet("upcoming/{count}")]
        public async Task<IActionResult> GetUpcomingMatches(int count)
        {
            var matches = await _matchService.GetUpcomingMatchesAsync(count);
            return Ok(matches);
        }

        [HttpGet("recent/{count}")]
        public async Task<IActionResult> GetRecentMatches(int count)
        {
            var matches = await _matchService.GetRecentMatchesAsync(count);
            return Ok(matches);
        }

        [HttpGet("live")]
        public async Task<IActionResult> GetLiveMatches()
        {
            var matches = await _matchService.GetLiveMatchesAsync();
            return Ok(matches);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateMatch([FromBody] MatchCreateDto matchDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var match = new Match
            {
                SeasonId = matchDto.SeasonId,
                HomeTeamId = matchDto.HomeTeamId,
                AwayTeamId = matchDto.AwayTeamId,
                VenueId = matchDto.VenueId,
                ScheduledDateTime = matchDto.ScheduledDateTime,
                MatchNumber = "Match 1",
                Status = MatchStatus.Scheduled,
                Umpires = new List<Umpire>()
            };

            if (matchDto.Umpires != null && matchDto.Umpires.Any())
            {
                foreach (var umpireDto in matchDto.Umpires)
                {
                    var umpire = await _context.Umpires.FindAsync(umpireDto.UmpireId);
                    if (umpire == null)
                        return BadRequest($"Umpire with ID {umpireDto.UmpireId} not found.");
                    match.Umpires.Add(umpire);
                }
            }

            var createdMatch = await _matchService.CreateMatchAsync(match);
            return CreatedAtAction(nameof(GetMatch), new { id = createdMatch.MatchId }, createdMatch);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMatch(int id, [FromBody] Match match)
        {
            if (id != match.MatchId)
                return BadRequest();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedMatch = await _matchService.UpdateMatchAsync(match);
            return Ok(updatedMatch);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatch(int id)
        {
            var result = await _matchService.DeleteMatchAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/start-innings")]
        public async Task<IActionResult> StartInnings(int id, [FromBody] StartInningsDto inningsDto)
        {
            var match = await _context.Matches
                .Include(m => m.Innings)
                .FirstOrDefaultAsync(m => m.MatchId == id);

            if (match == null)
                return NotFound();

            if (match.Innings.Any(i => i.InningsNumber == inningsDto.InningsNumber))
                return BadRequest("Innings already exists for this match.");

            var innings = new Innings
            {
                MatchId = id,
                BattingTeamId = inningsDto.BattingTeamId,
                BowlingTeamId = inningsDto.BowlingTeamId,
                InningsNumber = inningsDto.InningsNumber,
                Runs = 0,
                Wickets = 0,
                Overs = 0,
                IsCompleted = false
            };

            _context.Innings.Add(innings);
            await _context.SaveChangesAsync();

            match.Status = MatchStatus.InProgress;
            await _context.SaveChangesAsync();

            return Ok(innings);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/ball")]
        public async Task<IActionResult> RecordBall(int id, [FromBody] BallByBallData ballData)
        {
            var innings = await _context.Innings
                .Include(i => i.BallByBallData)
                .FirstOrDefaultAsync(i => i.InningsId == ballData.InningsId && i.MatchId == id);

            if (innings == null)
                return NotFound("Innings not found.");

            if (innings.IsCompleted)
                return BadRequest("Innings is already completed.");

            // Populate navigation properties based on IDs
            ballData.Innings = await _context.Innings
                .Include(i => i.Match)
                .Include(i => i.BattingTeam)
                .Include(i => i.BowlingTeam)
                .FirstOrDefaultAsync(i => i.InningsId == ballData.InningsId);

            ballData.Bowler = await _context.Players.FindAsync(ballData.BowlerId);
            ballData.Batsman = await _context.Players.FindAsync(ballData.BatsmanId);
            ballData.NonStriker = await _context.Players.FindAsync(ballData.NonStrikerId);
            ballData.PlayerOut = ballData.IsWicket && ballData.PlayerOutId.HasValue ? await _context.Players.FindAsync(ballData.PlayerOutId) : null;
            ballData.Fielder = ballData.IsWicket && ballData.FielderId.HasValue ? await _context.Players.FindAsync(ballData.FielderId) : null;

            // Validate players
            var battingTeam = await _context.Teams
                .Include(t => t.Players)
                .FirstOrDefaultAsync(t => t.TeamId == innings.BattingTeamId);
            var bowlingTeam = await _context.Teams
                .Include(t => t.Players)
                .FirstOrDefaultAsync(t => t.TeamId == innings.BowlingTeamId);

            if (ballData.Bowler == null || !bowlingTeam.Players.Any(p => p.PlayerId == ballData.BowlerId))
                return BadRequest("Invalid BowlerId.");
            if (ballData.Batsman == null || !battingTeam.Players.Any(p => p.PlayerId == ballData.BatsmanId))
                return BadRequest("Invalid BatsmanId.");
            if (ballData.NonStriker == null || !battingTeam.Players.Any(p => p.PlayerId == ballData.NonStrikerId))
                return BadRequest("Invalid NonStrikerId.");
            if (ballData.IsWicket)
            {
                if (ballData.PlayerOutId.HasValue && (ballData.PlayerOut == null || !battingTeam.Players.Any(p => p.PlayerId == ballData.PlayerOutId)))
                    return BadRequest("Invalid PlayerOutId.");
                if (ballData.FielderId.HasValue && (ballData.Fielder == null || !bowlingTeam.Players.Any(p => p.PlayerId == ballData.FielderId)))
                    return BadRequest("Invalid FielderId.");
            }

            // Update innings stats
            innings.Runs += ballData.RunsScored + ballData.ExtraRuns;
            if (ballData.IsWicket)
                innings.Wickets += 1;

            if (ballData.IsExtra)
            {
                switch (ballData.ExtraType)
                {
                    case ExtraType.Wide:
                        innings.Wides += ballData.ExtraRuns;
                        break;
                    case ExtraType.NoBall:
                        innings.NoBalls += ballData.ExtraRuns;
                        break;
                    case ExtraType.Bye:
                        innings.Byes += ballData.ExtraRuns;
                        break;
                }
            }

            var ballsInInnings = innings.BallByBallData.Count;
            innings.Overs = ballsInInnings / 6 + (ballsInInnings % 6) / 10m;

            _context.BallByBallData.Add(ballData);
            await _context.SaveChangesAsync();

            return Ok(ballData);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/end-innings")]
        public async Task<IActionResult> EndInnings(int id, [FromBody] EndInningsDto endInningsDto)
        {
            var innings = await _context.Innings
                .FirstOrDefaultAsync(i => i.InningsId == endInningsDto.InningsId && i.MatchId == id);

            if (innings == null)
                return NotFound("Innings not found.");

            if (innings.IsCompleted)
                return BadRequest("Innings is already completed.");

            innings.IsCompleted = true;
            await _context.SaveChangesAsync();

            return Ok(innings);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/end")]
        public async Task<IActionResult> EndMatch(int id, [FromBody] EndMatchDto endMatchDto)
        {
            var match = await _context.Matches
                .Include(m => m.Innings)
                .FirstOrDefaultAsync(m => m.MatchId == id);

            if (match == null)
                return NotFound();

            if (match.Status == MatchStatus.Completed)
                return BadRequest("Match is already completed.");

            match.Status = MatchStatus.Completed;
            match.WinnerTeamId = endMatchDto.WinnerTeamId;
            match.WinMargin = endMatchDto.WinMargin;

            await _context.SaveChangesAsync();
            return Ok(match);
        }
    }

    public class StartInningsDto
    {
        public int BattingTeamId { get; set; }
        public int BowlingTeamId { get; set; }
        public int InningsNumber { get; set; }
    }

    public class EndInningsDto
    {
        public int InningsId { get; set; }
    }

    public class EndMatchDto
    {
        public int? WinnerTeamId { get; set; }
        public string WinMargin { get; set; }
    }
}