using Microsoft.EntityFrameworkCore;
using PasswordManager.Data;
using PasswordManager.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

//DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAuthService, AuthService>();


var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();
