using PasswordManager.DTOs;

namespace PasswordManager.Services
{
    public interface ILoginEntryService
    {
        Task<IEnumerable<LoginEntryDto>> GetAllAsync(int userId, string? domainFilter = null);
        Task<LoginEntryDto?> GetByIdAsync(int userId, int id);
        Task<LoginEntryDto> CreateAsync(int userId, LoginEntryDto dto);
        Task<bool> UpdateAsync(int userId, int id, LoginEntryDto dto);
        Task<bool> DeleteAsync(int userId, int id);
    }
}
