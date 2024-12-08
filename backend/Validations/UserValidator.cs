using backend.Models.DTOs;
using backend.Models.RequestModels;

namespace backend.Validations;

public class UserValidator
{
    public ValidationResult ValidateRegistration(UpdateUserRequest request)
    {
        var result = new ValidationResult();

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            result.AddError("Name is required");
        }
        else if (request.Name.Length < 2 || request.Name.Length > 50)
        {
            result.AddError("Name must be between 2 and 50 characters");
        }

        if (string.IsNullOrWhiteSpace(request.Surname))
        {
            result.AddError("Surname is required");
        }
        else if (request.Surname.Length < 2 || request.Surname.Length > 50)
        {
            result.AddError("Surname must be between 2 and 50 characters");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            result.AddError("Email is required");
        }
        else if (!IsValidEmail(request.Email))
        {
            result.AddError("Invalid email format");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            result.AddError("Password is required");
        }
        else
        {
            if (request.Password.Length < 8)
                result.AddError("Password must be at least 8 characters");
            
            if (!request.Password.Any(char.IsUpper))
                result.AddError("Password must contain at least one uppercase letter");
            
            if (!request.Password.Any(char.IsLower))
                result.AddError("Password must contain at least one lowercase letter");
            
            if (!request.Password.Any(char.IsDigit))
                result.AddError("Password must contain at least one number");
            
            if (!request.Password.Any(ch => !char.IsLetterOrDigit(ch)))
                result.AddError("Password must contain at least one special character");
        }
        
        if (string.IsNullOrWhiteSpace(request.DateOfBirth))
        {
            result.AddError("Date of birth is required");
        }
        else if (!DateTime.TryParse(request.DateOfBirth, out DateTime birthDate))
        {
            result.AddError("Invalid date format");
        }
        else
        {
            var today = DateTime.Today;
            var age = today.Year - birthDate.Year;
    
            if (birthDate.Date > today.AddYears(-age)) age--;

            if (birthDate > today)
            {
                result.AddError("Date of birth cannot be in the future");
            }
            else if (age < 12)
            {
                result.AddError("You must be at least 12 years old to register");
            }
            else if (age > 100)
            {
                result.AddError("Invalid date of birth");
            }
        }

        return result;
    }

    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}