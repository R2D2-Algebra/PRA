using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.DTOs;
using PasswordManager.Services;
using System.Security.Claims;

namespace PasswordManager.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SecureNoteController : ControllerBase
    {
        private readonly ISecureNoteService _service;

        public SecureNoteController(ISecureNoteService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue("id")!);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var notes = await _service.GetAllAsync(userId);
            return Ok(notes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetUserId();
            var note = await _service.GetByIdAsync(userId, id);
            if (note == null) return NotFound();
            return Ok(note);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SecureNoteDto dto)
        {
            var userId = GetUserId();
            var created = await _service.CreateAsync(userId, dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SecureNoteDto dto)
        {
            var userId = GetUserId();
            var updated = await _service.UpdateAsync(userId, id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var deleted = await _service.DeleteAsync(userId, id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
