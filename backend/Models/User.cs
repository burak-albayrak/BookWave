namespace backend.Models;

public class User
{
    public int UserID { get; set; }
    public string Location { get; set; }
    public int Age { get; set; }
    
    public virtual ICollection<Rating> Ratings { get; set; }
}