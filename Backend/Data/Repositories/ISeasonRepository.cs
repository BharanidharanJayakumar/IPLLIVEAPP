using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public interface ISeasonRepository : IRepository<Season>
    {
        Task<Season> GetActiveSeasonAsync();
    }
}