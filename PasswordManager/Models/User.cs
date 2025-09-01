namespace PasswordManager.Models
{
    public class User
    {
        public int Id { get; set; }

        //korisnički email
        public string Email { get; set; } = string.Empty;

        public string MasterPasswordHash { get; set; } = string.Empty;

        //UI postavke
        public string Theme { get; set; } = "light";  // "light" ili "dark"
        public string Font { get; set; } = "default"; // "Arial", "Times"
        public string Language { get; set; } = "hr";  // "hr", "en", "de"

        //timeout
        public DateTime LastActiveAt { get; set; } = DateTime.UtcNow;

        //lista zapisa korisnika
        public ICollection<LoginEntry>? LoginEntries { get; set; }
        public ICollection<SecureNote>? SecureNotes { get; set; }
        public ICollection<CreditCard>? CreditCards { get; set; }
    }
}
