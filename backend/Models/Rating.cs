namespace backend.Models;

public class Rating
{
    public int UserID { get; set; }
    public string ISBN { get; set; }
    public int BookRating { get; set; }
    public virtual Book Book { get; set; }
}