using Microsoft.AspNetCore.Mvc;
using PasswordManager.DTOs;
using PasswordManager.Services;

namespace PasswordManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var success = await _authService.RegisterAsync(dto);
            if (!success)
                return BadRequest("Korisnik s tim emailom već postoji.");

            return Ok("Registracija uspješna.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto);
            if (token == null)
                return Unauthorized("Pogrešan email ili lozinka.");

            return Ok(new { token });
        }

    }
}
