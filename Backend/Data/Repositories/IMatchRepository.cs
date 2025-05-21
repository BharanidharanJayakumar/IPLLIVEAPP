using IPLLive.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public interface IMatchRepository : IRepository<Match>
    {
        Task<IEnumerable<Match>> GetMatchesForDateAsync(DateTime date);
        Task<IEnumerable<Match>> GetMatchesByDateAsync(DateTime date);
        Task<IEnumerable<Match>> GetMatchesByTeamAsync(int teamId);
        Task<IEnumerable<Match>> GetMatchesBySeasonAsync(int seasonId);
        Task<Match> GetMatchWithDetailsAsync(int id);
        Task<IEnumerable<Match>> GetUpcomingMatchesAsync(int count);
        Task<IEnumerable<Match>> GetRecentlyCompletedMatchesAsync(int count);
        Task<IEnumerable<Match>> GetLiveMatchesAsync();
        Task<IEnumerable<Match>> GetMatchesByQueryAsync(Expression<Func<Match, bool>> predicate, Func<IQueryable<Match>, IQueryable<Match>> queryModifier = null);
    }
}
