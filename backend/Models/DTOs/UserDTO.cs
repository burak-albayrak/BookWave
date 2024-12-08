namespace backend.Models.DTOs;

public class UserDTO
{
    public int UserID { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime DateOfBirth { get; set; }
}

public class UpdateUserDTO
{
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public bool IsAdmin { get; set; }
}