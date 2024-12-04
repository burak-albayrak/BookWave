namespace backend.Models;

public class Reservation
{
    public int ReservationId { get; set; }
    public string ISBN { get; set; }
    public int UserID { get; set; }
    public int AddressID { get; set; }
    public int CardID { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public Book Book { get; set; }
    public User User { get; set; }
    public Address Addresses { get; set; }
    public CreditCard Card { get; set; }
}