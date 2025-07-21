using Microsoft.EntityFrameworkCore;
using PasswordManager.Data;
using PasswordManager.DTOs;
using PasswordManager.Models;

namespace PasswordManager.Services
{
    public class CreditCardService : ICreditCardService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEncryptionService _encryptionService;

        public CreditCardService(ApplicationDbContext context, IEncryptionService encryptionService)
        {
            _context = context;
            _encryptionService = encryptionService;
        }

        public async Task<List<CreditCardDto>> GetAllAsync(int userId)
        {
            var cards = await _context.CreditCards
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return cards.Select(c => new CreditCardDto
            {
                Id = c.Id,
                CardNumber = _encryptionService.Decrypt(c.CardNumberEncrypted),
                Expiry = c.Expiry,
                Cvv = _encryptionService.Decrypt(c.CvvEncrypted)
            }).ToList();
        }

        public async Task<CreditCardDto?> GetByIdAsync(int userId, int id)
        {
            var card = await _context.CreditCards
                .FirstOrDefaultAsync(c => c.UserId == userId && c.Id == id);

            if (card == null) return null;

            return new CreditCardDto
            {
                Id = card.Id,
                CardNumber = _encryptionService.Decrypt(card.CardNumberEncrypted),
                Expiry = card.Expiry,
                Cvv = _encryptionService.Decrypt(card.CvvEncrypted)
            };
        }

        public async Task<CreditCardDto> CreateAsync(int userId, CreditCardDto dto)
        {
            var card = new CreditCard
            {
                CardNumberEncrypted = _encryptionService.Encrypt(dto.CardNumber),
                Expiry = dto.Expiry,
                CvvEncrypted = _encryptionService.Encrypt(dto.Cvv),
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.CreditCards.Add(card);
            await _context.SaveChangesAsync();

            dto.Id = card.Id;
            return dto;
        }

        public async Task<bool> UpdateAsync(int userId, int id, CreditCardDto dto)
        {
            var card = await _context.CreditCards
                .FirstOrDefaultAsync(c => c.UserId == userId && c.Id == id);

            if (card == null) return false;

            card.CardNumberEncrypted = _encryptionService.Encrypt(dto.CardNumber);
            card.Expiry = dto.Expiry;
            card.CvvEncrypted = _encryptionService.Encrypt(dto.Cvv);

            _context.CreditCards.Update(card);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int userId, int id)
        {
            var card = await _context.CreditCards
                .FirstOrDefaultAsync(c => c.UserId == userId && c.Id == id);

            if (card == null) return false;

            _context.CreditCards.Remove(card);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
