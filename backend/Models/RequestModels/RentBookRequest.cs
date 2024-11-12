namespace backend.Models.RequestModels;

public class RentBookRequest
{
    public string ISBN { get; set; }
    public int UserID { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}