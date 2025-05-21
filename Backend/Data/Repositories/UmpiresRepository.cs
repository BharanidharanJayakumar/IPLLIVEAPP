using IPLLive.API.Data;
using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public class UmpiresRepository : Repository<Umpire>, IUmpiresRepository
    {
        private readonly ApplicationDbContext _db;

        public UmpiresRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Umpire>> GetUmpiresByMatchAsync(int matchId)
        {
            return await _db.Umpires
                .Where(u => u.Matches.Any(m => m.MatchId == matchId))
                .ToListAsync();
        }
    }
}