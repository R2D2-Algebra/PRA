using PasswordManager.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PasswordManager.Services
{
    public interface ICreditCardService
    {
        Task<List<CreditCardDto>> GetAllAsync(int userId);
        Task<CreditCardDto?> GetByIdAsync(int userId, int id);
        Task<CreditCardDto> CreateAsync(int userId, CreditCardDto dto);
        Task<bool> UpdateAsync(int userId, int id, CreditCardDto dto);
        Task<bool> DeleteAsync(int userId, int id);
    }
}
