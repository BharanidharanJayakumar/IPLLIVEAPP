using IPLLive.API.Models;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public interface IScoreService
    {
        Task<Innings> CreateInningsAsync(Innings innings);
        Task<Innings> UpdateInningsAsync(Innings innings);
        Task<BallByBallData> AddBallAsync(BallByBallData ball);
        Task<BattingPerformance> UpdateBattingPerformanceAsync(BattingPerformance battingPerformance);
        Task<BowlingPerformance> UpdateBowlingPerformanceAsync(BowlingPerformance bowlingPerformance);
        Task<bool> EndInningsAsync(int inningsId);
        Task<bool> EndMatchAsync(int matchId, int? winnerTeamId, string winMargin);
    }
}
