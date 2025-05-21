using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public interface IScoreRepository : IRepository<Score>
    {
        Task<IEnumerable<Score>> GetScoresByMatchAsync(int matchId);
    }
}