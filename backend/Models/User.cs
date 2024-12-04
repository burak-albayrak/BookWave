namespace backend.Models;

public class User
{
    public int UserID { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public DateTime DateOfBirth { get; set; }
    public bool IsAdmin { get; set; }
    public virtual ICollection<Reservation> Reservations { get; set; }
    public virtual ICollection<Address> Addresses { get; set; }
    public virtual CreditCard CreditCard { get; set; }
}