using IPLLive.API.Models;
using IPLLive.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IPLLive.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeasonController : ControllerBase
    {
        private readonly ISeasonService _seasonService;

        public SeasonController(ISeasonService seasonService)
        {
            _seasonService = seasonService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSeasons()
        {
            var seasons = await _seasonService.GetAllSeasonsAsync();
            return Ok(seasons);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSeason(int id)
        {
            var season = await _seasonService.GetSeasonByIdAsync(id);
            if (season == null) return NotFound();
            return Ok(season);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveSeason()
        {
            var season = await _seasonService.GetActiveSeasonAsync();
            if (season == null) return NotFound();
            return Ok(season);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateSeason([FromBody] Season season)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var createdSeason = await _seasonService.CreateSeasonAsync(season);
            return CreatedAtAction(nameof(GetSeason), new { id = createdSeason.SeasonId }, createdSeason);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSeason(int id, [FromBody] Season season)
        {
            if (id != season.SeasonId) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updatedSeason = await _seasonService.UpdateSeasonAsync(season);
            return Ok(updatedSeason);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeason(int id)
        {
            var result = await _seasonService.DeleteSeasonAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}