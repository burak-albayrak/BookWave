namespace backend.Models;

public class CreditCard
{
    public int CardID { get; set; }
    public int UserID { get; set; }
    public string CardName { get; set; }
    public string CardNumber { get; set; }
    public string CardHolderName { get; set; }
    public int ExpirationMonth { get; set; }
    public int ExpirationYear { get; set; }
    public string CVV { get; set; }
    
    public virtual User User { get; set; }
}