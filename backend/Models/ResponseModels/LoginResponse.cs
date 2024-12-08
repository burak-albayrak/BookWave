namespace backend.Models.ResponseModels;

public class LoginResponse
{
    public int UserID { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public bool IsAdmin { get; set; }
    public string Message { get; set; }
}