using IPLLive.API.Data;
using IPLLive.API.Models;
using IPLLive.API.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public class PointTableRepository : Repository<PointsTableEntry>, IPointTableRepository
    {
        private readonly ApplicationDbContext _db;

        public PointTableRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<IEnumerable<PointsTableEntry>> GetPointTableBySeasonAsync(int seasonId)
        {
            return await _db.PointsTableEntries
                .Where(p => p.SeasonId == seasonId)
                .ToListAsync();
        }
    }
}