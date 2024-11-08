namespace backend.Validations;

public class SearchValidation
{
    public bool ValidateSearchTerm(string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            return false;
            
        if (searchTerm.Length < 2)
            return false;
            
        return true;
    }
}