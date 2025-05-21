////using IPLLive.API.DTOs;
////using IPLLive.API.Services;
////using Microsoft.AspNetCore.Mvc;
////using System.Threading.Tasks;

////namespace IPLLive.API.Controllers
////{
////    [Route("api/[controller]")]
////    [ApiController]
////    public class AuthController : ControllerBase
////    {
////        private readonly IAuthService _authService;

////        public AuthController(IAuthService authService)
////        {
////            _authService = authService;
////        }

////        [HttpPost("login")]
////        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
////        {
////            if (!ModelState.IsValid)
////                return BadRequest(ModelState);

////            var result = await _authService.LoginAsync(loginDto);

////            if (!result.Success)
////                return Unauthorized(new { message = result.Message });

////            return Ok(new
////            {
////                token = result.Token,
////                user = result.User,
////                message = result.Message
////            });
////        }

////        [HttpPost("register")]
////        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
////        {
////            if (!ModelState.IsValid)
////                return BadRequest(ModelState);

////            var result = await _authService.RegisterAsync(registerDto);

////            if (!result.Success)
////                return BadRequest(new { message = result.Message });

////            return Ok(new { message = result.Message });
////        }
////    }
////}using IPLLive.API.Services;
//using IPLLive.API.DTOs;
//using IPLLive.API.Services;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using System.Threading.Tasks;

//namespace IPLLive.API.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AuthController : ControllerBase
//    {
//        private readonly IAuthService _authService;

//        public AuthController(IAuthService authService)
//        {
//            _authService = authService;
//        }

//        [HttpPost("login")]
//        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
//        {
//            var (success, message, token, user) = await _authService.LoginAsync(loginDto);
//            if (!success) return BadRequest(new { message });
//            return Ok(new { token, user });
//        }

//        [HttpPost("register")]
//        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
//        {
//            var (success, message) = await _authService.RegisterAsync(registerDto);
//            if (!success) return BadRequest(new { message });
//            return Ok(new { message });
//        }

//        [HttpGet("profile")]
//        [Authorize] // Requires authentication
//        public async Task<IActionResult> GetProfile()
//        {
//            var userId = int.Parse(User.Identity.Name); // Extract user ID from JWT claim
//            var user = await _authService.GetUserByIdAsync(userId);
//            if (user == null) return NotFound();
//            var userDto = new UserDto
//            {
//                UserId = user.UserId,
//                Username = user.Username,
//                Email = user.Email,
//                FirstName = user.FirstName,
//                LastName = user.LastName,
//                IsAdmin = user.IsAdmin,
//                CreatedAt = user.CreatedAt,
//                LastLogin = user.LastLogin
//            };
//            return Ok(userDto);
//        }
//    }
//}using IPLLive.API.Services;
using IPLLive.API.DTOs;
using IPLLive.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IPLLive.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var (success, message, token, user) = await _authService.LoginAsync(loginDto);
            if (!success) return BadRequest(new { message });
            return Ok(new { token, user });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var (success, message) = await _authService.RegisterAsync(registerDto);
            if (!success) return BadRequest(new { message });
            return Ok(new { message });
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            // Debug the claims in the token
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return BadRequest(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest(new { message = "Invalid User ID in token" });
            }

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"User with ID {userId} not found" });
            }

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
            return Ok(userDto);
        }
    }
}