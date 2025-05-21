using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public interface IBallByBallRepository : IRepository<BallByBallData>
    {
        Task<IEnumerable<BallByBallData>> GetBallsByInningsAsync(int inningsId);
    }
}