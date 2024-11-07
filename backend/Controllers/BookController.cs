using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private readonly IRepository _repository;

    public BookController(IRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Book>>> SearchBooks([FromQuery] string searchTerm)
    {
        var books = await _repository.SearchBooks(searchTerm);
        return Ok(books);
    }

    [HttpGet("{isbn}")]
    public async Task<ActionResult<Book>> GetBook(string isbn)
    {
        var book = await _repository.GetBookById(isbn);
        if (book == null)
            return NotFound();
            
        return Ok(book);
    }

    [HttpPost("rent")]
    public async Task<ActionResult> RentBook([FromBody] Rating rating)
    {
        var success = await _repository.CreateReservation(
            rating.ISBN, 
            rating.UserID, 
            rating.StartDate, 
            rating.EndDate);

        if (!success)
            return BadRequest("Book is not available for rent");

        await _repository.UpdateBookStatus(rating.ISBN, false);
        return Ok();
    }

    [HttpGet("user/{userId}/books")]
    public async Task<ActionResult<IEnumerable<Book>>> GetUserBooks(int userId)
    {
        var books = await _repository.GetUserBooks(userId);
        return Ok(books);
    }
}
