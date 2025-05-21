using IPLLive.API.Data;
using IPLLive.API.Data.Repositories;
using IPLLive.API.Hubs;
using IPLLive.API.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public class BallByBallService : IBallByBallService
    {
        private readonly IRepository<BallByBallData> _ballRepository;
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<ScoreHub> _hubContext;

        public BallByBallService(IRepository<BallByBallData> ballRepository, ApplicationDbContext context, IHubContext<ScoreHub> hubContext)
        {
            _ballRepository = ballRepository;
            _context = context;
            _hubContext = hubContext;
        }

        public async Task<IEnumerable<BallByBallData>> GetAllBallsAsync()
        {
            return await _ballRepository.GetAllAsync();
        }

        public async Task<BallByBallData> GetBallByIdAsync(int id)
        {
            return await _ballRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<BallByBallData>> GetBallsByInningsAsync(int inningsId)
        {
            return await _ballRepository.GetAllAsync(b => b.InningsId == inningsId);
        }

        public async Task<BallByBallData> CreateBallAsync(BallByBallData ball)
        {
            await _ballRepository.AddAsync(ball);
            await _ballRepository.SaveAsync();
            await _hubContext.Clients.All.SendAsync("BallAdded", ball);
            return ball;
        }

        public async Task<BallByBallData> UpdateBallAsync(BallByBallData ball)
        {
            await _ballRepository.UpdateAsync(ball);
            await _ballRepository.SaveAsync();
            await _hubContext.Clients.All.SendAsync("BallUpdated", ball);
            return ball;
        }

        public async Task<bool> DeleteBallAsync(int id)
        {
            var ball = await _ballRepository.GetByIdAsync(id);
            if (ball == null) return false;
            await _ballRepository.DeleteAsync(ball);
            await _ballRepository.SaveAsync();
            await _hubContext.Clients.All.SendAsync("BallDeleted", id);
            return true;
        }
    }
}