namespace backend.Validations;

public class ValidationResult
{
    public bool IsValid { get; set; }
    public List<string> Errors { get; set; } = new List<string>();

    public void AddError(string error)
    {
        Errors.Add(error);
        IsValid = false;
    }

    public ValidationResult()
    {
        IsValid = true;
    }
}