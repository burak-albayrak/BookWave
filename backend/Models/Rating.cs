namespace backend.Models;

public class Rating
{
    public int RatingId { get; set; }
    public string ISBN { get; set; }
    public int UserID { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public virtual Book Book { get; set; }
    public virtual User User { get; set; }
}