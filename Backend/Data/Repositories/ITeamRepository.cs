using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public interface ITeamRepository : IRepository<Team>
    {
        Task<IEnumerable<Team>> GetTeamsWithPlayersAsync();
        Task<Team> GetTeamWithPlayersAsync(int id);
        Task<IEnumerable<Team>> GetTeamsBySeasonAsync(int seasonId);
    }
}
