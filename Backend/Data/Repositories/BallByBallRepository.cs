using IPLLive.API.Data;
using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public class BallByBallRepository : Repository<BallByBallData>, IBallByBallRepository
    {
        private readonly ApplicationDbContext _db;

        public BallByBallRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<IEnumerable<BallByBallData>> GetBallsByInningsAsync(int inningsId)
        {
            return await _db.BallByBallData
                .Where(b => b.InningsId == inningsId)
                .ToListAsync();
        }
    }
}