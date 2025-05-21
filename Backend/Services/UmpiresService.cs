using IPLLive.API.Data;
using IPLLive.API.Data.Repositories;
using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public class UmpiresService : IUmpiresService
    {
        private readonly IRepository<Umpire> _umpireRepository;
        private readonly ApplicationDbContext _context;

        public UmpiresService(IRepository<Umpire> umpireRepository, ApplicationDbContext context)
        {
            _umpireRepository = umpireRepository;
            _context = context;
        }

        public async Task<IEnumerable<Umpire>> GetAllUmpiresAsync()
        {
            return await _umpireRepository.GetAllAsync();
        }

        public async Task<Umpire> GetUmpireByIdAsync(int id)
        {
            return await _umpireRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Umpire>> GetUmpiresByMatchAsync(int matchId)
        {
            var umpires = await _context.Umpires
                .Where(u => u.Matches.Any(m => m.MatchId == matchId))
                .ToListAsync();
            return umpires;
        }

        public async Task<Umpire> CreateUmpireAsync(Umpire umpire)
        {
            await _umpireRepository.AddAsync(umpire);
            await _umpireRepository.SaveAsync();
            return umpire;
        }

        public async Task<Umpire> UpdateUmpireAsync(Umpire umpire)
        {
            await _umpireRepository.UpdateAsync(umpire);
            await _umpireRepository.SaveAsync();
            return umpire;
        }

        public async Task<bool> DeleteUmpireAsync(int id)
        {
            var umpire = await _umpireRepository.GetByIdAsync(id);
            if (umpire == null) return false;
            await _umpireRepository.DeleteAsync(umpire);
            await _umpireRepository.SaveAsync();
            return true;
        }
    }
}