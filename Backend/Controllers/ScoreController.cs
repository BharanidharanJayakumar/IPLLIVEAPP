using IPLLive.API.Models;
using IPLLive.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IPLLive.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ScoreController : ControllerBase
    {
        private readonly IScoreService _scoreService;

        public ScoreController(IScoreService scoreService)
        {
            _scoreService = scoreService;
        }

        [HttpPost("innings")]
        public async Task<IActionResult> CreateInnings([FromBody] Innings innings)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdInnings = await _scoreService.CreateInningsAsync(innings);
            return Ok(createdInnings);
        }

        [HttpPut("innings")]
        public async Task<IActionResult> UpdateInnings([FromBody] Innings innings)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedInnings = await _scoreService.UpdateInningsAsync(innings);
            return Ok(updatedInnings);
        }

        [HttpPost("ball")]
        public async Task<IActionResult> AddBall([FromBody] BallByBallData ball)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var addedBall = await _scoreService.AddBallAsync(ball);
            return Ok(addedBall);
        }

        [HttpPut("batting")]
        public async Task<IActionResult> UpdateBattingPerformance([FromBody] BattingPerformance battingPerformance)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedPerformance = await _scoreService.UpdateBattingPerformanceAsync(battingPerformance);
            return Ok(updatedPerformance);
        }

        [HttpPut("bowling")]
        public async Task<IActionResult> UpdateBowlingPerformance([FromBody] BowlingPerformance bowlingPerformance)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedPerformance = await _scoreService.UpdateBowlingPerformanceAsync(bowlingPerformance);
            return Ok(updatedPerformance);
        }

        [HttpPost("innings/end/{inningsId}")]
        public async Task<IActionResult> EndInnings(int inningsId)
        {
            var result = await _scoreService.EndInningsAsync(inningsId);

            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPost("match/end/{matchId}")]
        public async Task<IActionResult> EndMatch(int matchId, [FromQuery] int? winnerTeamId, [FromQuery] string winMargin)
        {
            var result = await _scoreService.EndMatchAsync(matchId, winnerTeamId, winMargin);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
