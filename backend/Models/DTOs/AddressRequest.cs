using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs;

public class AddressRequest
{
    [Required]
    public string AddressName { get; set; }

    [Required]
    public string Country { get; set; }
    
    [Required]
    public string City { get; set; }
    
    [Required]
    public string District { get; set; }
    
    [Required]
    public string PostalCode { get; set; }
    
    [Required]
    public string AddressLine { get; set; }
}