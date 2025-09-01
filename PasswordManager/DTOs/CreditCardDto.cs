namespace PasswordManager.DTOs
{
    public class CreditCardDto
    {
        public int? Id { get; set; }
        public string CardNumber { get; set; } = string.Empty;
        public string Expiry { get; set; } = string.Empty;
        public string Cvv { get; set; } = string.Empty;    
    }
}
