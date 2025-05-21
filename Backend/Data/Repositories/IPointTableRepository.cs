using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public interface IPointTableRepository : IRepository<PointsTableEntry>
    {
        Task<IEnumerable<PointsTableEntry>> GetPointTableBySeasonAsync(int seasonId);
    }
}