using IPLLive.API.Data;
using IPLLive.API.Data.Repositories;
using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public class SeasonService : ISeasonService
    {
        private readonly IRepository<Season> _seasonRepository;
        private readonly ApplicationDbContext _context;

        public SeasonService(IRepository<Season> seasonRepository, ApplicationDbContext context)
        {
            _seasonRepository = seasonRepository;
            _context = context;
        }

        public async Task<IEnumerable<Season>> GetAllSeasonsAsync()
        {
            return await _seasonRepository.GetAllAsync();
        }

        public async Task<Season> GetSeasonByIdAsync(int id)
        {
            return await _seasonRepository.GetByIdAsync(id);
        }

        public async Task<Season> GetActiveSeasonAsync()
        {
            return await _seasonRepository.GetFirstOrDefaultAsync(s => s.IsActive); // Use GetFirstOrDefaultAsync
        }

        public async Task<Season> CreateSeasonAsync(Season season)
        {
            await _seasonRepository.AddAsync(season);
            await _seasonRepository.SaveAsync();
            return season;
        }

        public async Task<Season> UpdateSeasonAsync(Season season)
        {
            await _seasonRepository.UpdateAsync(season);
            await _seasonRepository.SaveAsync();
            return season;
        }

        public async Task<bool> DeleteSeasonAsync(int id)
        {
            var season = await _seasonRepository.GetByIdAsync(id);
            if (season == null) return false;
            await _seasonRepository.DeleteAsync(season);
            await _seasonRepository.SaveAsync();
            return true;
        }
    }
}