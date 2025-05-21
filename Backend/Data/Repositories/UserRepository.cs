using IPLLive.API.Data;
using IPLLive.API.Models;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly ApplicationDbContext _db;

        public UserRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}