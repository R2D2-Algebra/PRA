using PasswordManager.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PasswordManager.Services
{
    public interface ISecureNoteService
    {
        Task<List<SecureNoteDto>> GetAllAsync(int userId);
        Task<SecureNoteDto?> GetByIdAsync(int userId, int id);
        Task<SecureNoteDto> CreateAsync(int userId, SecureNoteDto dto);
        Task<bool> UpdateAsync(int userId, int id, SecureNoteDto dto);
        Task<bool> DeleteAsync(int userId, int id);
    }
}
