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
    public async Task<ActionResult<PaginationRequestModel<BookWithRatingDto>>> SearchBooks(
        [FromQuery] string searchTerm, 
        [FromQuery] BookSortOption? sortOption,
        [FromQuery] bool? isAvailable,
        int page)
    {
        var searchValidation = new SearchValidation();
        var pageValidation = new PageValidation();

        if (!string.IsNullOrEmpty(searchTerm) && !searchValidation.ValidateSearchTerm(searchTerm))
            return BadRequest("Invalid search term");

        if (!pageValidation.ValidatePage(page))
            return BadRequest("Invalid page number");

        var skip = pageValidation.CalculateSkip(page);
        var take = pageValidation.GetPageSize();

        var books = await _repository.SearchBooks(searchTerm, sortOption, isAvailable, skip, take);
        var totalCount = await _repository.GetSearchResultCount(searchTerm, isAvailable);

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
        
            if (reservations == null)
            {
                return Ok(new List<UserBookDto>());
            }

            var userBooks = reservations.Select(r => new UserBookDto
            {
                ISBN = r.Book?.ISBN,
                BookTitle = r.Book?.BookTitle,
                BookAuthor = r.Book?.BookAuthor,
                YearOfPublication = r.Book?.YearOfPublication ?? 0,
                Publisher = r.Book?.Publisher,
                ImageUrlSmall = r.Book?.ImageUrlSmall,
                ImageUrlMedium = r.Book?.ImageUrlMedium,
                ImageUrlLarge = r.Book?.ImageUrlLarge,
                StartDate = r.StartDate,
                EndDate = r.EndDate,
                AddressName = r.Addresses?.AddressName ?? "N/A",
                AddressLine = r.Addresses?.AddressLine ?? "N/A",
                City = r.Addresses?.City ?? "N/A",
                District = r.Addresses?.District ?? "N/A",
                CardName = r.Card?.CardName ?? "N/A",
                CardNumber = r.Card?.CardNumber != null ? 
                    r.Card.CardNumber.Substring(Math.Max(0, r.Card.CardNumber.Length - 4)) : "N/A",
                CardHolderName = r.Card?.CardHolderName ?? "N/A"
            }).ToList();

            Console.WriteLine($"Controller: Successfully retrieved {userBooks.Count} books");
            return Ok(userBooks);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Controller: Error getting user books: {ex.Message}");
            Console.WriteLine($"Controller: Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { message = "Error retrieving user's books", error = ex.Message });
        }
    }
    
    [HttpPost("rent")]
    public async Task<ActionResult> RentBook([FromBody] RentBookRequest request)
    {
        try 
        {
            // Verify address exists and belongs to user
            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.AddressID == request.AddressID && a.UserID == request.UserID);
            if (address == null)
            {
                return BadRequest("Invalid address selected");
            }

            // Verify credit card exists and belongs to user
            var card = await _context.CreditCards
                .FirstOrDefaultAsync(c => c.CardID == request.CardID && c.UserID == request.UserID);
            if (card == null)
            {
                return BadRequest("Invalid credit card selected");
            }

            // Check if book is available
            var book = await _context.Books
                .FirstOrDefaultAsync(b => b.ISBN == request.ISBN && b.IsAvailable);
            if (book == null)
            {
                return BadRequest("Book is not available for reservation");
            }

            var reservation = new Reservation
            {
                ISBN = request.ISBN,
                UserID = request.UserID,
                AddressID = request.AddressID,
                CardID = request.CardID,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            book.IsAvailable = false;
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book reserved successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error reserving book", error = ex.Message });
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
