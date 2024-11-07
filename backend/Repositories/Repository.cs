using backend.Configs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class Repository : IRepository
{
    private readonly BookWaveContext _context;

    public Repository(BookWaveContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Book>> SearchBooks(string searchTerm)
    {
        return await _context.Books
            .Where(b => b.BookTitle.Contains(searchTerm) || 
                        b.BookAuthor.Contains(searchTerm) ||
                        b.Publisher.Contains(searchTerm))
            .ToListAsync();
    }

    public async Task<Book> GetBookById(string isbn)
    {
        return await _context.Books.FindAsync(isbn);
    }

    public async Task<bool> CreateReservation(string isbn, int userId, DateTime startDate, DateTime endDate)
    {
        try
        {
            var rating = new Rating
            {
                ISBN = isbn,
                UserID = userId,
                StartDate = startDate,
                EndDate = endDate
            };

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<IEnumerable<Book>> GetUserBooks(int userId)
    {
        return await _context.Books
            .Where(b => b.Ratings.Any(r => r.UserID == userId))
            .ToListAsync();
    }

    public async Task<bool> UpdateBookStatus(string isbn, bool isAvailable)
    {
        var book = await _context.Books.FindAsync(isbn);
        if (book == null) return false;
        
        book.IsAvailable = isAvailable;
        await _context.SaveChangesAsync();
        return true;
    }
}