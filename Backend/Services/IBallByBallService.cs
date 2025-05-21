using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public interface IBallByBallService
    {
        Task<IEnumerable<BallByBallData>> GetAllBallsAsync();
        Task<BallByBallData> GetBallByIdAsync(int id);
        Task<IEnumerable<BallByBallData>> GetBallsByInningsAsync(int inningsId);
        Task<BallByBallData> CreateBallAsync(BallByBallData ball);
        Task<BallByBallData> UpdateBallAsync(BallByBallData ball);
        Task<bool> DeleteBallAsync(int id);
    }
}