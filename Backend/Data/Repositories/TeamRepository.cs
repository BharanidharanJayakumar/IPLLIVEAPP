using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public class TeamRepository : Repository<Team>, ITeamRepository
    {
        private readonly ApplicationDbContext _db;

        public TeamRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Team>> GetTeamsWithPlayersAsync()
        {
            return await _db.Teams
                .Include(t => t.Players)
                .Include(t => t.Coaches)
                .Include(t => t.HomeVenue)
                .ToListAsync();
        }

        public async Task<Team> GetTeamWithPlayersAsync(int id)
        {
            return await _db.Teams
                .Include(t => t.Players)
                .Include(t => t.Coaches)
                .Include(t => t.HomeVenue)
                .FirstOrDefaultAsync(t => t.TeamId == id);
        }

        public async Task<IEnumerable<Team>> GetTeamsBySeasonAsync(int seasonId)
        {
            // Get teams that played in a specific season by checking match records
            var teamIds = await _db.Matches
                .Where(m => m.SeasonId == seasonId)
                .Select(m => new { m.HomeTeamId, m.AwayTeamId })
                .ToListAsync();

            var uniqueTeamIds = teamIds
                .SelectMany(ids => new[] { ids.HomeTeamId, ids.AwayTeamId })
                .Distinct();

            return await _db.Teams
                .Where(t => uniqueTeamIds.Contains(t.TeamId))
                .ToListAsync();
        }
    }
}
