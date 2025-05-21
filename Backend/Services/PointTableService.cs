using IPLLive.API.Data;
using IPLLive.API.Data.Repositories;
using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public class PointTableService : IPointTableService
    {
        private readonly IRepository<PointsTableEntry> _pointTableRepository;
        private readonly ApplicationDbContext _context;

        public PointTableService(IRepository<PointsTableEntry> pointTableRepository, ApplicationDbContext context)
        {
            _pointTableRepository = pointTableRepository;
            _context = context;
        }

        public async Task<IEnumerable<PointsTableEntry>> GetAllPointTableEntriesAsync()
        {
            return await _pointTableRepository.GetAllAsync();
        }

        public async Task<PointsTableEntry> GetPointTableEntryByIdAsync(int id)
        {
            return await _pointTableRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<PointsTableEntry>> GetPointTableBySeasonAsync(int seasonId)
        {
            return await _pointTableRepository.GetAllAsync(p => p.SeasonId == seasonId);
        }

        public async Task<PointsTableEntry> CreatePointTableEntryAsync(PointsTableEntry entry)
        {
            await _pointTableRepository.AddAsync(entry);
            await _pointTableRepository.SaveAsync();
            return entry;
        }

        public async Task<PointsTableEntry> UpdatePointTableEntryAsync(PointsTableEntry entry)
        {
            await _pointTableRepository.UpdateAsync(entry);
            await _pointTableRepository.SaveAsync();
            return entry;
        }

        public async Task<bool> DeletePointTableEntryAsync(int id)
        {
            var entry = await _pointTableRepository.GetByIdAsync(id);
            if (entry == null) return false;
            await _pointTableRepository.DeleteAsync(entry);
            await _pointTableRepository.SaveAsync();
            return true;
        }
    }
}