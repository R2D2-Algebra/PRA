using Microsoft.EntityFrameworkCore;
using PasswordManager.Data;
using PasswordManager.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var jwtSettings = builder.Configuration.GetSection("Jwt");
var keyString = jwtSettings["Key"];
if (string.IsNullOrEmpty(keyString))
{
    throw new InvalidOperationException("JWT Key is not configured.");
}
var key = Encoding.UTF8.GetBytes(keyString);


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

//DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddScoped<IEncryptionService, EncryptionService>();

builder.Services.AddScoped<ILoginEntryService, LoginEntryService>();

builder.Services.AddScoped<ISecureNoteService, SecureNoteService>();

builder.Services.AddScoped<ICreditCardService, CreditCardService>();





var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
