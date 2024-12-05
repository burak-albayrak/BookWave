namespace backend.Models.DTOs;

public class UpdateUserRequest
{
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string DateOfBirth { get; set; } 
}