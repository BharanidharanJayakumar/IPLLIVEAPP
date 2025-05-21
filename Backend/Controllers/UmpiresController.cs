using IPLLive.API.Models;
using IPLLive.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IPLLive.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UmpiresController : ControllerBase
    {
        private readonly IUmpiresService _umpiresService;

        public UmpiresController(IUmpiresService umpiresService)
        {
            _umpiresService = umpiresService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUmpires()
        {
            var umpires = await _umpiresService.GetAllUmpiresAsync();
            return Ok(umpires);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUmpire(int id)
        {
            var umpire = await _umpiresService.GetUmpireByIdAsync(id);
            if (umpire == null) return NotFound();
            return Ok(umpire);
        }

        [HttpGet("match/{matchId}")]
        public async Task<IActionResult> GetUmpiresByMatch(int matchId)
        {
            var umpires = await _umpiresService.GetUmpiresByMatchAsync(matchId);
            return Ok(umpires);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateUmpire([FromBody] Umpire umpire)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var createdUmpire = await _umpiresService.CreateUmpireAsync(umpire);
            return CreatedAtAction(nameof(GetUmpire), new { id = createdUmpire.UmpireId }, createdUmpire);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUmpire(int id, [FromBody] Umpire umpire)
        {
            if (id != umpire.UmpireId) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updatedUmpire = await _umpiresService.UpdateUmpireAsync(umpire);
            return Ok(updatedUmpire);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUmpire(int id)
        {
            var result = await _umpiresService.DeleteUmpireAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}