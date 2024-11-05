using Microsoft.AspNetCore.Mvc;
using backend.Configs;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    private readonly BookWaveContext _context;

    public TestController(BookWaveContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult TestConnection()
    {
        try
        {
            // Veritabanı bağlantısını test et
            bool canConnect = _context.Database.CanConnect();
            
            if (canConnect)
            {
                return Ok("Database connection successful!");
            }
            else
            {
                return BadRequest("Could not connect to database.");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }
}