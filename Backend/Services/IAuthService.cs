using IPLLive.API.DTOs;
using IPLLive.API.Models;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string Message, string Token, UserDto User)> LoginAsync(LoginDto loginDto);
        Task<(bool Success, string Message)> RegisterAsync(RegisterDto registerDto);
        Task<User> GetUserByIdAsync(int id); // Added method
        Task<(bool Success, string Message)> RegisterAdminUser(); // Add this line
    }
}