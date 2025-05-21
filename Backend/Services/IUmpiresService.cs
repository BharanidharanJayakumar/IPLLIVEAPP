using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public interface IUmpiresService
    {
        Task<IEnumerable<Umpire>> GetAllUmpiresAsync();
        Task<Umpire> GetUmpireByIdAsync(int id);
        Task<IEnumerable<Umpire>> GetUmpiresByMatchAsync(int matchId);
        Task<Umpire> CreateUmpireAsync(Umpire umpire);
        Task<Umpire> UpdateUmpireAsync(Umpire umpire);
        Task<bool> DeleteUmpireAsync(int id);
    }
}