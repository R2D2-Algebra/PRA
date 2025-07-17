using Microsoft.EntityFrameworkCore;
using PasswordManager.Models;

namespace PasswordManager.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<LoginEntry> LoginEntries => Set<LoginEntry>();
        public DbSet<SecureNote> SecureNotes => Set<SecureNote>();
        public DbSet<CreditCard> CreditCards => Set<CreditCard>();
    }
}
