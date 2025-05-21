using IPLLive.API.Models;
using IPLLive.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IPLLive.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerController : ControllerBase
    {
        private readonly IPlayerService _playerService;

        public PlayerController(IPlayerService playerService)
        {
            _playerService = playerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPlayers()
        {
            var players = await _playerService.GetAllPlayersAsync();
            return Ok(players);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlayer(int id)
        {
            var player = await _playerService.GetPlayerByIdAsync(id);

            if (player == null)
                return NotFound();

            return Ok(player);
        }

        [HttpGet("team/{teamId}")]
        public async Task<IActionResult> GetPlayersByTeam(int teamId)
        {
            var players = await _playerService.GetPlayersByTeamAsync(teamId);
            return Ok(players);
        }

        [HttpGet("role/{role}")]
        public async Task<IActionResult> GetPlayersByRole(string role)
        {
            var players = await _playerService.GetPlayersByRoleAsync(role);
            return Ok(players);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreatePlayer([FromBody] Player player)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdPlayer = await _playerService.CreatePlayerAsync(player);
            return CreatedAtAction(nameof(GetPlayer), new { id = createdPlayer.PlayerId }, createdPlayer);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlayer(int id, [FromBody] Player player)
        {
            if (id != player.PlayerId)
                return BadRequest(new { message = "PlayerId in URL does not match PlayerId in body" });

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return BadRequest(new { message = "Validation failed", errors });
            }

            var existingPlayer = await _playerService.GetPlayerByIdAsync(id);
            if (existingPlayer == null)
                return NotFound();

            var updatedPlayer = await _playerService.UpdatePlayerAsync(player);
            return Ok(updatedPlayer);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlayer(int id)
        {
            var result = await _playerService.DeletePlayerAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}