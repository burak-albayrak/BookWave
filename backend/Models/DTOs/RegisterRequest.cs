using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs;

public class RegisterRequest
{
    [Required]
    public string Name { get; set; }
    
    [Required]
    public string Surname { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    public string Password { get; set; }
    
    [Required]
    public string DateOfBirth { get; set; }
    
    [Required]
    public string Location { get; set; }
}