namespace backend.Validations;

public class PageValidation
{
    private const int MaxPageSize = 10;
    
    public bool ValidatePage(int page)
    {
        return page > 0;
    }
    
    public int GetPageSize()
    {
        return MaxPageSize;
    }
    
    public int CalculateSkip(int page)
    {
        return (page - 1) * MaxPageSize;
    }
}