namespace backend.Models.DTOs;

public class RatingImportDto
{
    public string ISBN { get; set; }
    public int UserID { get; set; }
    public int BookRating { get; set; }
}