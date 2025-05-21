using IPLLive.API.Data;
using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public class SeasonRepository : Repository<Season>, ISeasonRepository
    {
        private readonly ApplicationDbContext _db;

        public SeasonRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<Season> GetActiveSeasonAsync()
        {
            return await _db.Seasons
                .FirstOrDefaultAsync(s => s.IsActive); // Correct usage
        }
    }
}