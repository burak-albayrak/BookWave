using backend.Configs;
using backend.Models;
using backend.Models.DTOs;
using backend.Models.RequestModels;
using backend.Repositories;
using backend.Validations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private readonly IRepository _repository;
    private readonly BookWaveContext _context;

    public BookController(IRepository repository, BookWaveContext context)
    {
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

    [HttpGet("{isbn}")]
    public async Task<ActionResult<Book>> GetBook(string isbn)
    {
        var book = await _repository.GetBookById(isbn);
        if (book == null)
            return NotFound();
            
        return Ok(book);
    }

    [HttpPost("rent")]
    public async Task<ActionResult> RentBook([FromBody] Reservation reservation)
    {
        var success = await _repository.CreateReservation(
            reservation.ISBN, 
            reservation.UserID, 
            reservation.StartDate, 
            reservation.EndDate);

        if (!success)
            return BadRequest("Book is not available for rent");

        await _repository.UpdateBookStatus(reservation.ISBN, false);
        return Ok();
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
