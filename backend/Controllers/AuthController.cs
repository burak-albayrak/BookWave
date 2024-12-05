using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Configs;
using backend.Models.DTOs;
using backend.Validations;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[EnableCors]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly BookWaveContext _context;

    public AuthController(BookWaveContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(UpdateUserRequest request)
    {
        var validator = new UserValidator();
        var validationResult = validator.ValidateRegistration(request);

        if (!validationResult.IsValid)
        {
            return BadRequest(new { errors = validationResult.Errors });
        }

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            return BadRequest(new { errors = new List<string> { "Email already exists" } });
        }

        var user = new User
        {
            Name = request.Name,
            Surname = request.Surname,
            Email = request.Email,
            Password = request.Password,
            DateOfBirth = DateTime.Parse(request.DateOfBirth),
            IsAdmin = false
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        user.Password = null; // Don't send password back
        return Ok(user);
    }
    
    [HttpPut("update/{id}")]
    public async Task<ActionResult<User>> UpdateUser(int id, UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(id);
    
        if (user == null)
        {
            return NotFound("User not found");
        }

        if (!string.IsNullOrEmpty(request.Name))
            user.Name = request.Name;
        if (!string.IsNullOrEmpty(request.Surname))
            user.Surname = request.Surname;
        if (!string.IsNullOrEmpty(request.Email))
            user.Email = request.Email;
        if (!string.IsNullOrEmpty(request.Password))
            user.Password = request.Password;

        await _context.SaveChangesAsync();
    
        user.Password = null; // Don't send password back
        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && 
                                      u.Password == request.Password);

        if (user == null)
        {
            return NotFound(new { message = "Invalid email or password" });
        }

        return Ok(new LoginResponse
        {
            UserID = user.UserID,
            Name = user.Name,
            Surname = user.Surname,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            Message = "Login successful"
        });
    }
    
    [HttpPut("change-password/{id}")]
    public async Task<ActionResult> ChangePassword(int id, UpdatePasswordRequest request)
    {
        var user = await _context.Users.FindAsync(id);
    
        if (user == null)
        {
            return NotFound("User not found");
        }

        if (user.Password != request.CurrentPassword)
        {
            return BadRequest("Current password is incorrect");
        }

        if (request.NewPassword != request.ConfirmNewPassword)
        {
            return BadRequest("New passwords do not match");
        }

        user.Password = request.NewPassword;
        await _context.SaveChangesAsync();
    
        return Ok(new { message = "Password updated successfully" });
    }
}