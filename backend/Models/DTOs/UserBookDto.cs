namespace backend.Models.DTOs;

public class UserBookDto
{
    public string ISBN { get; set; }
    public string BookTitle { get; set; }
    public string BookAuthor { get; set; }
    public int YearOfPublication { get; set; }
    public string Publisher { get; set; }
    public string ImageUrlSmall { get; set; }
    public string ImageUrlMedium { get; set; }
    public string ImageUrlLarge { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}