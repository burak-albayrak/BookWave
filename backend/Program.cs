using backend.Configs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<BookWaveContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddTransient<DataImportService>();

var app = builder.Build();

// CSV import işlemi
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dataImportService = services.GetRequiredService<DataImportService>();

    try 
    {
        var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var dataDirectory = Path.Combine(baseDirectory, "Data");
        
        dataImportService.ImportBooks(Path.Combine(dataDirectory, "books.csv"));
        dataImportService.ImportUsers(Path.Combine(dataDirectory, "users.csv"));
        dataImportService.ImportRatings(Path.Combine(dataDirectory, "ratings.csv"));
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error importing data: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();