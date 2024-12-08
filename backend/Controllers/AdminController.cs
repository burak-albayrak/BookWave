using backend.Configs;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly BookWaveContext _context;

    public AdminController(BookWaveContext context)
    {
        _context = context;
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new UserDTO
            {
                UserID = u.UserID,
                Name = u.Name,
                Surname = u.Surname,
                Email = u.Email,
                IsAdmin = u.IsAdmin,
                DateOfBirth = u.DateOfBirth,
            })
            .ToListAsync();

        return Ok(users);
    }
    
    [HttpGet("users/{userId}/books")]
    public async Task<ActionResult> GetUserRentedBooks(int userId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var reservations = await _context.Reservations
                .Where(r => r.UserID == userId)
                .Include(r => r.Book)
                .Include(r => r.Addresses)
                .Include(r => r.Card)
                .OrderByDescending(r => r.StartDate)
                .ToListAsync();

            var userBooksWithStatus = reservations.Select(r => new
            {
                BookDetails = new UserBookDto
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
                    District = r.Addresses?.District ?? "N/A"
                },
                Status = DateTime.Now > r.EndDate ? "Overdue" : "Active",
                RemainingDays = (r.EndDate - DateTime.Now).Days
            }).ToList();

            return Ok(userBooksWithStatus);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error retrieving user's books", error = ex.Message });
        }
    }

    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserDTO updateUserDto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound("User not found");
        }

        user.Name = updateUserDto.Name;
        user.Surname = updateUserDto.Surname;
        user.Email = updateUserDto.Email;
        user.IsAdmin = updateUserDto.IsAdmin;

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new UserDTO
            {
                UserID = user.UserID,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                IsAdmin = user.IsAdmin,
                DateOfBirth = user.DateOfBirth,
            });
        }
        catch (DbUpdateException)
        {
            return BadRequest("Unable to update user");
        }
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound("User not found");
        }

        var hasActiveReservations = await _context.Reservations
            .AnyAsync(r => r.UserID == id && r.EndDate >= DateTime.Today);

        if (hasActiveReservations)
        {
            return BadRequest("Cannot delete user with active reservations");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok("User deleted successfully");
    }
    
    [HttpGet("books")]
public async Task<IActionResult> GetBooks([FromQuery] int page = 1, [FromQuery] string searchTerm = "")
{
    const int pageSize = 12;
    var query = _context.Books.AsQueryable();

    if (!string.IsNullOrWhiteSpace(searchTerm))
    {
        query = query.Where(b => 
            b.BookTitle.Contains(searchTerm) || 
            b.BookAuthor.Contains(searchTerm) ||
            b.ISBN.Contains(searchTerm)
        );
    }

    var totalBooks = await query.CountAsync();
    var totalPages = (int)Math.Ceiling(totalBooks / (double)pageSize);

    var books = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(b => new
        {
            b.ISBN,
            b.BookTitle,
            b.BookAuthor,
            b.YearOfPublication,
            b.Publisher,
            b.ImageUrlSmall,
            b.ImageUrlMedium,
            b.ImageUrlLarge,
            b.IsAvailable
        })
        .ToListAsync();

    return Ok(new { books, totalPages, currentPage = page });
}

[HttpPut("books/{isbn}")]
public async Task<IActionResult> UpdateBook(string isbn, [FromBody] UpdateBookDto updateBookDto)
{
    var book = await _context.Books.FindAsync(isbn);
    if (book == null)
        return NotFound("Book not found");

    book.BookTitle = updateBookDto.BookTitle;
    book.BookAuthor = updateBookDto.BookAuthor;
    book.YearOfPublication = updateBookDto.YearOfPublication;
    book.Publisher = updateBookDto.Publisher;
    book.ImageUrlSmall = updateBookDto.ImageUrlSmall;
    book.ImageUrlMedium = updateBookDto.ImageUrlMedium;
    book.ImageUrlLarge = updateBookDto.ImageUrlLarge;
    book.IsAvailable = updateBookDto.IsAvailable;

    await _context.SaveChangesAsync();
    return Ok(book);
}

[HttpDelete("books/{isbn}")]
public async Task<IActionResult> DeleteBook(string isbn)
{
    var book = await _context.Books.FindAsync(isbn);
    if (book == null)
        return NotFound("Book not found");

    var hasActiveReservations = await _context.Reservations
        .AnyAsync(r => r.ISBN == isbn && r.EndDate > DateTime.Now);

    if (hasActiveReservations)
        return BadRequest("Cannot delete book with active reservations");

    _context.Books.Remove(book);
    await _context.SaveChangesAsync();
    return Ok();
}
}