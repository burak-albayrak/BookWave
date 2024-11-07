namespace backend.Models;

public class Book
{
    public string ISBN { get; set; }
    public string BookTitle { get; set; }
    public string BookAuthor { get; set; }
    public int YearOfPublication { get; set; }
    public string Publisher { get; set; }
    public string ImageUrlSmall { get; set; }
    public string ImageUrlMedium { get; set; }
    public string ImageUrlLarge { get; set; }
    public bool IsAvailable { get; set; } = true;
    public virtual ICollection<Rating> Ratings { get; set; }
}