namespace backend.Models.DTOs;

public class AddCreditCardRequest
{
    public string CardName { get; set; }
    public string CardNumber { get; set; }
    public string CardHolderName { get; set; }
    public int ExpirationMonth { get; set; }
    public int ExpirationYear { get; set; }
    public string CVV { get; set; }
}