﻿using Microsoft.EntityFrameworkCore;
using PasswordManager.Data;
using PasswordManager.DTOs;
using PasswordManager.Models;

namespace PasswordManager.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthService(ApplicationDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<bool> RegisterAsync(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return false;

            var user = new User
            {
                Email = dto.Email,
                MasterPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.MasterPassword),
                LastActiveAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return null;

            bool isValid = BCrypt.Net.BCrypt.Verify(dto.MasterPassword, user.MasterPasswordHash);
            if (!isValid) return null;

            string token = _jwtService.GenerateToken(user); // koristi IJwtService
            return new AuthResponseDto(user.Email, token);
        }
    }
}
