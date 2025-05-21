//using IPLLive.API.Data;
//using IPLLive.API.DTOs;
//using IPLLive.API.Helpers;
//using IPLLive.API.Models;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Configuration;
//using System;
//using System.Threading.Tasks;

//namespace IPLLive.API.Services
//{
//    public class AuthService : IAuthService
//    {
//        private readonly ApplicationDbContext _context;
//        private readonly JwtHelper _jwtHelper;

//        public AuthService(ApplicationDbContext context, IConfiguration configuration)
//        {
//            _context = context;
//            _jwtHelper = new JwtHelper(configuration);
//        }

//        public async Task<(bool Success, string Message, string Token, UserDto User)> LoginAsync(LoginDto loginDto)
//        {
//            try
//            {
//                var user = await _context.Users
//                    .FirstOrDefaultAsync(u => u.Username == loginDto.Username || u.Email == loginDto.Username);

//                // Create admin user if it doesn't exist
//                if (user == null && loginDto.Username == "admin@ipllive.com" && loginDto.Password == "Admin@123")
//                {
//                    user = new User
//                    {
//                        Username = "admin", // Set a default username
//                        Email = "admin@ipllive.com",
//                        PasswordHash = PasswordHasher.HashPassword("Admin@123"),
//                        FirstName = "Admin",
//                        LastName = "User",
//                        IsAdmin = true,
//                        IsActive = true,
//                        CreatedAt = DateTime.UtcNow,
//                        LastLogin = DateTime.UtcNow
//                    };
//                    await _context.Users.AddAsync(user);
//                    await _context.SaveChangesAsync();
//                }

//                if (user == null)
//                    return (false, "User not found", null, null);

//                if (!user.IsActive)
//                    return (false, "User account is deactivated", null, null);

//                bool isPasswordValid = PasswordHasher.VerifyPassword(loginDto.Password, user.PasswordHash);

//                if (!isPasswordValid)
//                    return (false, "Invalid password", null, null);

//                // Ensure admin role for admin@ipllive.com
//                if (user.Email == "admin@ipllive.com" && isPasswordValid && loginDto.Password == "Admin@123")
//                {
//                    user.IsAdmin = true;
//                }

//                // Update last login timestamp
//                user.LastLogin = DateTime.UtcNow;
//                await _context.SaveChangesAsync();



//                // Generate JWT token with role
//                string token = _jwtHelper.GenerateToken(user);

//                // Map to UserDTO
//                var userDto = new UserDto
//                {
//                    UserId = user.UserId,
//                    Username = user.Username,
//                    Email = user.Email,
//                    FirstName = user.FirstName,
//                    LastName = user.LastName,
//                    IsAdmin = user.IsAdmin,
//                    CreatedAt = user.CreatedAt,
//                    LastLogin = user.LastLogin
//                };

//                return (true, "Login successful", token, userDto);
//            }
//            catch (Exception ex)
//            {
//                return (false, $"Login failed: {ex.Message}", null, null);
//            }
//        }

//        public async Task<(bool Success, string Message)> RegisterAsync(RegisterDto registerDto)
//        {
//            try
//            {
//                // Check if username already exists
//                if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
//                    return (false, "Username already exists");

//                // Check if email already exists
//                if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
//                    return (false, "Email already exists");

//                // Prevent admin email registration (allow only if user doesn't exist)
//                if (registerDto.Email == "admin@ipllive.com" && await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
//                    return (false, "This email is reserved for the admin account");

//                // Create new user
//                var user = new User
//                {
//                    Username = registerDto.Username,
//                    Email = registerDto.Email,
//                    PasswordHash = PasswordHasher.HashPassword(registerDto.Password),
//                    FirstName = registerDto.FirstName,
//                    LastName = registerDto.LastName,
//                    IsAdmin = false,
//                    IsActive = true,
//                    CreatedAt = DateTime.UtcNow
//                };

//                await _context.Users.AddAsync(user);
//                await _context.SaveChangesAsync();

//                return (true, "Registration successful");
//            }
//            catch (Exception ex)
//            {
//                return (false, $"Registration failed: {ex.Message}");
//            }
//        }

//        public async Task<User> GetUserByIdAsync(int id)
//        {
//            return await _context.Users.FindAsync(id);
//        }
//    }
//}
using IPLLive.API.Data;
using IPLLive.API.DTOs;
using IPLLive.API.Helpers;
using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _jwtHelper = new JwtHelper(configuration);
        }

        public async Task<(bool Success, string Message, string Token, UserDto User)> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == loginDto.Username || u.Email == loginDto.Username);

                // Create admin user if it doesn't exist
                if (user == null && loginDto.Username == "admin@ipllive.com" && loginDto.Password == "Admin@123")
                {
                    user = new User
                    {
                        Username = "admin", // Set a default username
                        Email = "admin@ipllive.com",
                        PasswordHash = PasswordHasher.HashPassword("Admin@123"),
                        FirstName = "Admin",
                        LastName = "User",
                        IsAdmin = true,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        LastLogin = DateTime.UtcNow
                    };
                    await _context.Users.AddAsync(user);
                    await _context.SaveChangesAsync();
                }

                if (user == null)
                    return (false, "User not found", null, null);

                if (!user.IsActive)
                    return (false, "User account is deactivated", null, null);

                bool isPasswordValid = PasswordHasher.VerifyPassword(loginDto.Password, user.PasswordHash);

                if (!isPasswordValid)
                    return (false, "Invalid password", null, null);

                // Ensure admin role for admin@ipllive.com
                if (user.Email == "admin@ipllive.com" && isPasswordValid && loginDto.Password == "Admin@123")
                {
                    user.IsAdmin = true;
                }

                // Update last login timestamp
                user.LastLogin = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Generate JWT token with role
                string token = _jwtHelper.GenerateToken(user);

                // Map to UserDTO
                var userDto = new UserDto
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    IsAdmin = user.IsAdmin,
                    CreatedAt = user.CreatedAt,
                    LastLogin = user.LastLogin
                };

                return (true, "Login successful", token, userDto);
            }
            catch (Exception ex)
            {
                return (false, $"Login failed: {ex.Message}", null, null);
            }
        }

        public async Task<(bool Success, string Message)> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                // Check if username already exists
                if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
                    return (false, "Username already exists");

                // Check if email already exists
                if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                    return (false, "Email already exists");

                // Prevent admin email registration (allow only if user doesn't exist)
                if (registerDto.Email == "admin@ipllive.com" && await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                    return (false, "This email is reserved for the admin account");

                // Create new user
                var user = new User
                {
                    Username = registerDto.Username,
                    Email = registerDto.Email,
                    PasswordHash = PasswordHasher.HashPassword(registerDto.Password),
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    IsAdmin = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                return (true, "Registration successful");
            }
            catch (Exception ex)
            {
                return (false, $"Registration failed: {ex.Message}");
            }
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        // Add this new method here
        public async Task<(bool Success, string Message)> RegisterAdminUser()
        {
            var registerDto = new RegisterDto
            {
                Username = "admin",
                Email = "admin@ipllive.com",
                Password = "Admin@123",
                FirstName = "Admin",
                LastName = "User"
            };

            // Temporarily bypass the admin email check
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            if (existingUser != null)
                return (false, "Admin user already exists");

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = PasswordHasher.HashPassword(registerDto.Password),
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                IsAdmin = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Registered Admin User with PasswordHash: {user.PasswordHash}");
            return (true, "Admin user registered successfully");
        }
    }
}