using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public interface IUmpiresRepository : IRepository<Umpire>
    {
        Task<IEnumerable<Umpire>> GetUmpiresByMatchAsync(int matchId);
    }
}