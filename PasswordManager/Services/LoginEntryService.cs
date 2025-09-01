using PasswordManager.Data;
using PasswordManager.DTOs;
using PasswordManager.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace PasswordManager.Services
{
    public class LoginEntryService : ILoginEntryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEncryptionService _encryptionService;

        public LoginEntryService(ApplicationDbContext context, IEncryptionService encryptionService)
        {
            _context = context;
            _encryptionService = encryptionService;
        }

        public async Task<IEnumerable<LoginEntryDto>> GetAllAsync(int userId, string? domainFilter = null)
        {
            var query = _context.LoginEntries
                .Where(le => le.UserId == userId);

            if (!string.IsNullOrWhiteSpace(domainFilter))
                query = query.Where(le => le.Domain.Contains(domainFilter));

            var list = await query.ToListAsync();

            return list.Select(le => new LoginEntryDto
            {
                Id = le.Id,
                Domain = le.Domain,
                Username = le.Username,
                Password = _encryptionService.Decrypt(le.PasswordEncrypted),
                CreatedAt = le.CreatedAt
            });
        }

        public async Task<LoginEntryDto?> GetByIdAsync(int userId, int id)
        {
            var entry = await _context.LoginEntries
                .FirstOrDefaultAsync(le => le.UserId == userId && le.Id == id);

            if (entry == null) return null;

            return new LoginEntryDto
            {
                Id = entry.Id,
                Domain = entry.Domain,
                Username = entry.Username,
                Password = _encryptionService.Decrypt(entry.PasswordEncrypted),
                CreatedAt = entry.CreatedAt
            };
        }

        public async Task<LoginEntryDto> CreateAsync(int userId, LoginEntryDto dto)
        {
            var entry = new LoginEntry
            {
                Domain = dto.Domain,
                Username = dto.Username,
                PasswordEncrypted = _encryptionService.Encrypt(dto.Password),
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };

            _context.LoginEntries.Add(entry);
            await _context.SaveChangesAsync();

            dto.Id = entry.Id;
            dto.CreatedAt = entry.CreatedAt;

            return dto;
        }

        public async Task<bool> UpdateAsync(int userId, int id, LoginEntryDto dto)
        {
            var entry = await _context.LoginEntries
                .FirstOrDefaultAsync(le => le.UserId == userId && le.Id == id);

            if (entry == null) return false;

            entry.Domain = dto.Domain;
            entry.Username = dto.Username;
            entry.PasswordEncrypted = _encryptionService.Encrypt(dto.Password);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int userId, int id)
        {
            var entry = await _context.LoginEntries
                .FirstOrDefaultAsync(le => le.UserId == userId && le.Id == id);

            if (entry == null) return false;

            _context.LoginEntries.Remove(entry);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
