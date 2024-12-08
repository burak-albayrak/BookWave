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
    public string AddressName { get; set; }
    public string AddressLine { get; set; }
    public string City { get; set; }
    public string District { get; set; }
    public string CardName { get; set; }
    public string CardNumber { get; set; }
    public string CardHolderName { get; set; }
}