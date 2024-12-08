using backend.Configs;
using backend.Models;
using backend.Models.DTOs;
using backend.Models.RequestModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CreditCardController : ControllerBase
{
    private readonly BookWaveContext _context;

    public CreditCardController(BookWaveContext context)
    {
        _context = context;
    }

    [HttpPost("add/{userId}")]
    public async Task<ActionResult<CreditCard>> AddCreditCard(int userId, AddCreditCardRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        var creditCard = new CreditCard
        {
            UserID = userId,
            CardName = request.CardName,
            CardNumber = request.CardNumber,
            CardHolderName = request.CardHolderName,
            ExpirationMonth = request.ExpirationMonth,
            ExpirationYear = request.ExpirationYear,
            CVV = request.CVV
        };

        _context.CreditCards.Add(creditCard);
        await _context.SaveChangesAsync();

        creditCard.CVV = "***";
        return Ok(creditCard);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<CreditCard>>> GetUserCreditCard(int userId)
    {
        var creditCards = await _context.CreditCards
            .Where(c => c.UserID == userId)
            .ToListAsync();

        if (!creditCards.Any())
        {
            return Ok(new List<CreditCard>());
        }

        foreach (var card in creditCards)
        {
            card.CVV = "***";
        }

        return Ok(creditCards);
    }

    [HttpPut("update/{cardId}")]
    public async Task<ActionResult<CreditCard>> UpdateCreditCard(int cardId, AddCreditCardRequest request)
    {
        var creditCard = await _context.CreditCards
            .FirstOrDefaultAsync(c => c.CardID == cardId);

        if (creditCard == null)
        {
            return NotFound("Credit card not found");
        }

        creditCard.CardName = request.CardName;
        creditCard.CardNumber = request.CardNumber;
        creditCard.CardHolderName = request.CardHolderName;
        creditCard.ExpirationMonth = request.ExpirationMonth;
        creditCard.ExpirationYear = request.ExpirationYear;
        creditCard.CVV = request.CVV;

        await _context.SaveChangesAsync();

        creditCard.CVV = "***";
        return Ok(creditCard);
    }
}