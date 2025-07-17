namespace PasswordManager.Models
{
    public class CreditCard
    {
        public int Id { get; set; }
        public string CardNumberEncrypted { get; set; } = string.Empty;
        public string Expiry { get; set; } = string.Empty;
        public string CvvEncrypted { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
