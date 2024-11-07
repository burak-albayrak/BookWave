namespace backend.Configs;

public class RatingImportDto
{
    public int RatingId { get; set; }
    public string ISBN { get; set; }
    public int UserID { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}