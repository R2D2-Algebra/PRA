namespace PasswordManager.DTOs
{
    public class LoginEntryDto
    {
        public int Id { get; set; }  
        public string Domain { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;  
        public DateTime CreatedAt { get; set; }
    }
}
