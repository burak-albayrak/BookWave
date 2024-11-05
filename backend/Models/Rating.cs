namespace backend.Models;

public class Rating
{
    public int RatingID { get; set; }
    public int UserID { get; set; }
    public string ISBN { get; set; }
    public int BookRating { get; set; }
    
    public virtual User User { get; set; }
    public virtual Book Book { get; set; }
}