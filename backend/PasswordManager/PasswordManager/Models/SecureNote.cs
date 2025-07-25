﻿namespace PasswordManager.Models
{
    public class SecureNote
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ContentEncrypted { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
