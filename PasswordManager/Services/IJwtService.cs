using PasswordManager.Models;

namespace PasswordManager.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
