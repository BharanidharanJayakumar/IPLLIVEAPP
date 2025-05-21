using IPLLive.API.Data;
using IPLLive.API.Data.Repositories;
using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public class TeamsService : ITeamsService
    {
        private readonly IRepository<Team> _teamRepository;
        private readonly ApplicationDbContext _context;

        public TeamsService(IRepository<Team> teamRepository, ApplicationDbContext context)
        {
            _teamRepository = teamRepository;
            _context = context;
        }

        public async Task<IEnumerable<Team>> GetAllTeamsAsync()
        {
            return await _teamRepository.GetAllAsync();
        }

        public async Task<Team> GetTeamByIdAsync(int id)
        {
            return await _teamRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Team>> GetTeamsBySeasonAsync(int seasonId)
        {
            var teams = await _context.Teams
                .Include(t => t.HomeMatches)
                .Where(t => t.HomeMatches.Any(m => m.SeasonId == seasonId))
                .ToListAsync();
            return teams;
        }

        public async Task<Team> CreateTeamAsync(Team team)
        {
            await _teamRepository.AddAsync(team);
            await _teamRepository.SaveAsync();
            return team;
        }

        public async Task<Team> UpdateTeamAsync(Team team)
        {
            await _teamRepository.UpdateAsync(team);
            await _teamRepository.SaveAsync();
            return team;
        }

        public async Task<bool> DeleteTeamAsync(int id)
        {
            var team = await _teamRepository.GetByIdAsync(id);
            if (team == null) return false;
            await _teamRepository.DeleteAsync(team);
            await _teamRepository.SaveAsync();
            return true;
        }
    }
}