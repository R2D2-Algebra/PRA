﻿using PasswordManager.DTOs;
using PasswordManager.Models;

namespace PasswordManager.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    }
}
