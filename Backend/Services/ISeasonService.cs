using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public interface ISeasonService
    {
        Task<IEnumerable<Season>> GetAllSeasonsAsync();
        Task<Season> GetSeasonByIdAsync(int id);
        Task<Season> GetActiveSeasonAsync();
        Task<Season> CreateSeasonAsync(Season season);
        Task<Season> UpdateSeasonAsync(Season season);
        Task<bool> DeleteSeasonAsync(int id);
    }
}