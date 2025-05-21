using IPLLive.API.Models;
using IPLLive.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IPLLive.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BallByBallController : ControllerBase
    {
        private readonly IBallByBallService _ballByBallService;

        public BallByBallController(IBallByBallService ballByBallService)
        {
            _ballByBallService = ballByBallService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBalls()
        {
            var balls = await _ballByBallService.GetAllBallsAsync();
            return Ok(balls);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBall(int id)
        {
            var ball = await _ballByBallService.GetBallByIdAsync(id);
            if (ball == null) return NotFound();
            return Ok(ball);
        }

        [HttpGet("innings/{inningsId}")]
        public async Task<IActionResult> GetBallsByInnings(int inningsId)
        {
            var balls = await _ballByBallService.GetBallsByInningsAsync(inningsId);
            return Ok(balls);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateBall([FromBody] BallByBallData ball)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var createdBall = await _ballByBallService.CreateBallAsync(ball);
            return CreatedAtAction(nameof(GetBall), new { id = createdBall.BallId }, createdBall);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBall(int id, [FromBody] BallByBallData ball)
        {
            if (id != ball.BallId) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updatedBall = await _ballByBallService.UpdateBallAsync(ball);
            return Ok(updatedBall);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBall(int id)
        {
            var result = await _ballByBallService.DeleteBallAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}