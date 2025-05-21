using IPLLive.API.Data;
using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public class ScoreRepository : Repository<Score>, IScoreRepository
    {
        private readonly ApplicationDbContext _db;

        public ScoreRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Score>> GetScoresByMatchAsync(int matchId)
        {
            return await _db.Scores
                .Where(s => s.MatchId == matchId)
                .ToListAsync();
        }
    }
}