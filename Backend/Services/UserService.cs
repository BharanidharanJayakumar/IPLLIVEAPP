using IPLLive.API.Data;
using IPLLive.API.Data.Repositories;
using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepository;
        private readonly ApplicationDbContext _context;

        public UserService(IRepository<User> userRepository, ApplicationDbContext context)
        {
            _userRepository = userRepository;
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            await _userRepository.AddAsync(user);
            await _userRepository.SaveAsync();
            return user;
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveAsync();
            return user;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;
            await _userRepository.DeleteAsync(user);
            await _userRepository.SaveAsync();
            return true;
        }
    }
}