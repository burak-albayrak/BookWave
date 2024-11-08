using backend.Configs;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class Repository : IRepository
{
    private readonly BookWaveContext _context;

    public Repository(BookWaveContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BookWithRatingDto>> SearchBooks(string searchTerm, int skip, int take)
    {
        var books = await _context.Books
            .Where(b => b.BookTitle.Contains(searchTerm) || 
                        b.BookAuthor.Contains(searchTerm) ||
                        b.Publisher.Contains(searchTerm))
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        var booksWithRatings = new List<BookWithRatingDto>();
        foreach (var book in books)
        {
            var averageRating = await GetBookAverageRating(book.ISBN);
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

        return booksWithRatings;
    }

    public async Task<int> GetSearchResultCount(string searchTerm)
    {
        return await _context.Books
            .Where(b => b.BookTitle.Contains(searchTerm) || 
                        b.BookAuthor.Contains(searchTerm) ||
                        b.Publisher.Contains(searchTerm))
            .CountAsync();
    }

    public async Task<Book> GetBookById(string isbn)
    {
        return await _context.Books.FindAsync(isbn);
    }
    

    public async Task<bool> CreateReservation(string isbn, int userId, DateTime startDate, DateTime endDate)
    {
        try
        {
            var reservation = new Reservation
            {
                ISBN = isbn,
                UserID = userId,
                StartDate = startDate,
                EndDate = endDate
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> CreateRating(string isbn, int userId, int bookRating)
    {
        try
        {
            var rating = new Rating
            {
                ISBN = isbn,
                UserID = userId,
                BookRating = bookRating
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
    
    public async Task<double> GetBookAverageRating(string isbn)
    {
        var ratings = await _context.Ratings
            .Where(r => r.ISBN == isbn)
            .Select(r => r.BookRating)
            .ToListAsync();

        if (!ratings.Any()) return 0;

        var average = ratings.Average(r => r);
        return Math.Round((average / 2), 1);
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