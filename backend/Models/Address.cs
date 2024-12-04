namespace backend.Models;

public class Address
{
    public int AddressID { get; set; }
    public int UserID { get; set; }
    public string AddressName { get; set; }
    public string Country { get; set; }
    public string City { get; set; }
    public string District { get; set; }
    public string PostalCode { get; set; }
    public string AddressLine { get; set; }
    
    public virtual User User { get; set; }
}