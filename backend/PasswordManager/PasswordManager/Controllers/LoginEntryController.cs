using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.DTOs;
using PasswordManager.Services;

namespace PasswordManager.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LoginEntryController : ControllerBase
    {
        private readonly ILoginEntryService _loginEntryService;

        public LoginEntryController(ILoginEntryService loginEntryService)
        {
            _loginEntryService = loginEntryService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst("id");
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? domain)
        {
            int userId = GetUserId();
            var entries = await _loginEntryService.GetAllAsync(userId, domain);
            return Ok(entries);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            int userId = GetUserId();
            var entry = await _loginEntryService.GetByIdAsync(userId, id);
            if (entry == null)
                return NotFound();
            return Ok(entry);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LoginEntryDto dto)
        {
            int userId = GetUserId();
            var created = await _loginEntryService.CreateAsync(userId, dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LoginEntryDto dto)
        {
            int userId = GetUserId();
            var updated = await _loginEntryService.UpdateAsync(userId, id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            int userId = GetUserId();
            var deleted = await _loginEntryService.DeleteAsync(userId, id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
