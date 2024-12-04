using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Configs;
using backend.Models.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AddressController : ControllerBase
{
    private readonly BookWaveContext _context;

    public AddressController(BookWaveContext context)
    {
        _context = context;
    }

    [HttpPost("add/{userId}")]
    public async Task<ActionResult<Address>> AddAddress(int userId, AddressRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        var address = new Address
        {
            UserID = userId,
            AddressName = request.AddressName,
            Country = request.Country,
            City = request.City,
            District = request.District,
            PostalCode = request.PostalCode,
            AddressLine = request.AddressLine
        };

        _context.Addresses.Add(address);
        await _context.SaveChangesAsync();

        return Ok(address);
    }
    
    [HttpPut("update/{addressId}")]
    public async Task<ActionResult<Address>> UpdateAddress(int addressId, AddressRequest request)
    {
        var address = await _context.Addresses
            .FirstOrDefaultAsync(a => a.AddressID == addressId);

        if (address == null)
        {
            return NotFound("Address not found");
        }

        address.AddressName = request.AddressName;
        address.Country = request.Country;
        address.City = request.City;
        address.District = request.District;
        address.PostalCode = request.PostalCode;
        address.AddressLine = request.AddressLine;

        await _context.SaveChangesAsync();
        return Ok(address);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Address>>> GetUserAddress(int userId)
    {
        var addresses = await _context.Addresses
            .Where(a => a.UserID == userId)
            .ToListAsync();

        if (!addresses.Any())
        {
            return Ok(new List<Address>());
        }

        return Ok(addresses);
    }
}