using backend.Configs;
using backend.Models;
using backend.Models.DTOs;
using backend.Models.RequestModels;
using backend.Repositories;
using backend.Services;
using backend.Validations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private readonly IService _service;
    private readonly IRepository _repository;
    private readonly BookWaveContext _context;

    public BookController(IService service, IRepository repository, BookWaveContext context)
    {
        _service = service;
        _repository = repository;
        _context = context;
    }

    [HttpGet("search/{page}")]
    public async Task<ActionResult<PaginationRequestModel<BookWithRatingDto>>> SearchBooks([FromQuery] string searchTerm, int page)
    {
        var searchValidation = new SearchValidation();
        var pageValidation = new PageValidation();

        if (!searchValidation.ValidateSearchTerm(searchTerm))
            return BadRequest("Invalid search term");
    
        if (!pageValidation.ValidatePage(page))
            return BadRequest("Invalid page number");

        var skip = pageValidation.CalculateSkip(page);
        var take = pageValidation.GetPageSize();

        var books = await _repository.SearchBooks(searchTerm, skip, take);
        var totalCount = await _repository.GetSearchResultCount(searchTerm);

        return Ok(new PaginationRequestModel<BookWithRatingDto>
        {
            Items = books,
            TotalCount = totalCount,
            Page = page,
            PageSize = take
        });
    }
    
    [HttpGet("user/{userId}/books")]
    public async Task<ActionResult<IEnumerable<UserBookDto>>> GetUserBooks(int userId)
    {
        try
        {
            Console.WriteLine($"Controller: Getting books for user {userId}");
            var reservations = await _repository.GetUserActiveReservations(userId);
        
            var userBooks = reservations.Select(r => new UserBookDto
            {
                ISBN = r.Book.ISBN,
                BookTitle = r.Book.BookTitle,
                BookAuthor = r.Book.BookAuthor,
                YearOfPublication = r.Book.YearOfPublication,
                Publisher = r.Book.Publisher,
                ImageUrlSmall = r.Book.ImageUrlSmall,
                ImageUrlMedium = r.Book.ImageUrlMedium,
                ImageUrlLarge = r.Book.ImageUrlLarge,
                StartDate = r.StartDate,
                EndDate = r.EndDate
            }).ToList();

            Console.WriteLine($"Controller: Successfully retrieved {userBooks.Count} books");
            return Ok(userBooks);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Controller: Error getting user books: {ex.Message}");
            return StatusCode(500, new { message = "Error retrieving user's books", error = ex.Message });
        }
    }
    
    [HttpPost("rent")]
    public async Task<ActionResult> RentBook([FromBody] RentBookRequest request)
    {
        Console.WriteLine($"Received rent request for ISBN: {request.ISBN}, UserID: {request.UserID}");
        Console.WriteLine($"Dates: {request.StartDate} to {request.EndDate}");

        try 
        {
            var success = await _service.RentBook(
                request.ISBN,
                request.UserID,  // Add this missing parameter
                request.StartDate,
                request.EndDate
            );

            Console.WriteLine($"Rent operation result: {success}");

            if (success)
            {
                return Ok(new { message = "Book rented successfully" });
            }
        
            return BadRequest(new { message = "Failed to rent the book" });
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Validation error: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    [HttpGet("{isbn}")]
    public async Task<ActionResult<Book>> GetBook(string isbn)
    {
        var book = await _repository.GetBookById(isbn);
        if (book == null)
            return NotFound();
            
        return Ok(book);
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookWithRatingDto>>> GetBooks()
    {
        var books = await _context.Books.ToListAsync();
        var booksWithRatings = new List<BookWithRatingDto>();

        foreach (var book in books)
        {
            var averageRating = await _repository.GetBookAverageRating(book.ISBN);
            booksWithRatings.Add(new BookWithRatingDto
            {
                ISBN = book.ISBN,
                BookTitle = book.BookTitle,
                BookAuthor = book.BookAuthor,
                YearOfPublication = book.YearOfPublication,
                Publisher = book.Publisher,
                ImageUrlSmall = book.ImageUrlSmall,
                ImageUrlMedium = book.ImageUrlMedium,
                ImageUrlLarge = book.ImageUrlLarge,
                IsAvailable = book.IsAvailable,
                AverageRating = averageRating
            });
        }

        return Ok(booksWithRatings);
    }

    [HttpPost("rate")]
    public async Task<ActionResult> RateBook([FromBody] Rating rating)
    {
        var success = await _repository.CreateRating(rating.ISBN, rating.UserID, rating.BookRating);
        if (!success)
            return BadRequest("Rating could not be created");
        return Ok();
    }
}
