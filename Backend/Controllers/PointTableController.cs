using IPLLive.API.Models;
using IPLLive.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IPLLive.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PointTableController : ControllerBase
    {
        private readonly IPointTableService _pointTableService;

        public PointTableController(IPointTableService pointTableService)
        {
            _pointTableService = pointTableService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPointTableEntries()
        {
            var entries = await _pointTableService.GetAllPointTableEntriesAsync();
            return Ok(entries);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPointTableEntry(int id)
        {
            var entry = await _pointTableService.GetPointTableEntryByIdAsync(id);
            if (entry == null) return NotFound();
            return Ok(entry);
        }

        [HttpGet("season/{seasonId}")]
        public async Task<IActionResult> GetPointTableBySeason(int seasonId)
        {
            var entries = await _pointTableService.GetPointTableBySeasonAsync(seasonId);
            return Ok(entries);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreatePointTableEntry([FromBody] PointsTableEntry entry)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var createdEntry = await _pointTableService.CreatePointTableEntryAsync(entry);
            return CreatedAtAction(nameof(GetPointTableEntry), new { id = createdEntry.PointsTableEntryId }, createdEntry);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePointTableEntry(int id, [FromBody] PointsTableEntry entry)
        {
            if (id != entry.PointsTableEntryId) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updatedEntry = await _pointTableService.UpdatePointTableEntryAsync(entry);
            return Ok(updatedEntry);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePointTableEntry(int id)
        {
            var result = await _pointTableService.DeletePointTableEntryAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}