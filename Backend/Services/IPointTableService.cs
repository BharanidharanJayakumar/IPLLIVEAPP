using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public interface IPointTableService
    {
        Task<IEnumerable<PointsTableEntry>> GetAllPointTableEntriesAsync();
        Task<PointsTableEntry> GetPointTableEntryByIdAsync(int id);
        Task<IEnumerable<PointsTableEntry>> GetPointTableBySeasonAsync(int seasonId);
        Task<PointsTableEntry> CreatePointTableEntryAsync(PointsTableEntry entry);
        Task<PointsTableEntry> UpdatePointTableEntryAsync(PointsTableEntry entry);
        Task<bool> DeletePointTableEntryAsync(int id);
    }
}