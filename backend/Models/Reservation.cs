namespace backend.Models;

public class Reservation
{
    public int ReservationId { get; set; }
    public string ISBN { get; set; }
    public int UserID { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public virtual Book Book { get; set; }
    public virtual User User { get; set; }
}