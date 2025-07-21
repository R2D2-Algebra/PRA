using Microsoft.EntityFrameworkCore;
using PasswordManager.Data;
using PasswordManager.DTOs;
using PasswordManager.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordManager.Services
{
    public class SecureNoteService : ISecureNoteService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEncryptionService _encryptionService;

        public SecureNoteService(ApplicationDbContext context, IEncryptionService encryptionService)
        {
            _context = context;
            _encryptionService = encryptionService;
        }

        public async Task<List<SecureNoteDto>> GetAllAsync(int userId)
        {
            var notes = await _context.SecureNotes
                .Where(n => n.UserId == userId)
                .ToListAsync();

            return notes.Select(n => new SecureNoteDto
            {
                Id = n.Id,
                Title = n.Title,
                Content = _encryptionService.Decrypt(n.ContentEncrypted)
            }).ToList();
        }

        public async Task<SecureNoteDto?> GetByIdAsync(int userId, int id)
        {
            var note = await _context.SecureNotes
                .FirstOrDefaultAsync(n => n.UserId == userId && n.Id == id);

            if (note == null) return null;

            return new SecureNoteDto
            {
                Id = note.Id,
                Title = note.Title,
                Content = _encryptionService.Decrypt(note.ContentEncrypted)
            };
        }

        public async Task<SecureNoteDto> CreateAsync(int userId, SecureNoteDto dto)
        {
            var note = new SecureNote
            {
                Title = dto.Title,
                ContentEncrypted = _encryptionService.Encrypt(dto.Content),
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.SecureNotes.Add(note);
            await _context.SaveChangesAsync();

            dto.Id = note.Id;
            return dto;
        }

        public async Task<bool> UpdateAsync(int userId, int id, SecureNoteDto dto)
        {
            var note = await _context.SecureNotes
                .FirstOrDefaultAsync(n => n.UserId == userId && n.Id == id);

            if (note == null) return false;

            note.Title = dto.Title;
            note.ContentEncrypted = _encryptionService.Encrypt(dto.Content);

            _context.SecureNotes.Update(note);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int userId, int id)
        {
            var note = await _context.SecureNotes
                .FirstOrDefaultAsync(n => n.UserId == userId && n.Id == id);

            if (note == null) return false;

            _context.SecureNotes.Remove(note);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
