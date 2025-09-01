namespace PasswordManager.Models
{
    public class LoginEntry
    {
        public int Id { get; set; }
        public string Domain { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PasswordEncrypted { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
