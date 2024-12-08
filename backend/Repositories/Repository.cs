using backend.Configs;
using backend.Models;
using backend.Models.DTOs;
using backend.Validations;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class Repository : IRepository
{
    private readonly BookWaveContext _context;

    public Repository(BookWaveContext context)
    {
        _context = context;
    }

public async Task<IEnumerable<BookWithRatingDto>> SearchBooks(string searchTerm, BookSortOption? sortOption, bool? isAvailable, int skip, int take)
{
    var query = _context.Books.AsQueryable();

    // Filtreleme
    if (!string.IsNullOrEmpty(searchTerm))
    {
        query = query.Where(b => b.BookTitle.Contains(searchTerm) || 
                                b.BookAuthor.Contains(searchTerm) ||
                                b.Publisher.Contains(searchTerm));
    }

    if (isAvailable.HasValue)
    {
        query = query.Where(b => b.IsAvailable == isAvailable.Value);
    }

    // Önce tüm kitapları çekelim
    var allBooks = await query.ToListAsync();
    var booksWithRatings = new List<BookWithRatingDto>();

    // Her kitap için rating hesaplayalım
    foreach (var book in allBooks)
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

    // Sıralama
    if (sortOption.HasValue)
    {
        booksWithRatings = sortOption.Value switch
        {
            BookSortOption.TitleAsc => booksWithRatings.OrderBy(b => b.BookTitle).ToList(),
            BookSortOption.TitleDesc => booksWithRatings.OrderByDescending(b => b.BookTitle).ToList(),
            BookSortOption.RatingAsc => booksWithRatings.OrderBy(b => b.AverageRating).ToList(),
            BookSortOption.RatingDesc => booksWithRatings.OrderByDescending(b => b.AverageRating).ToList(),
            BookSortOption.AvailabilityAsc => booksWithRatings.OrderBy(b => b.IsAvailable).ToList(),
            BookSortOption.AvailabilityDesc => booksWithRatings.OrderByDescending(b => b.IsAvailable).ToList(),
            _ => booksWithRatings
        };
    }

    // En son sayfalama
    return booksWithRatings.Skip(skip).Take(take);
}
    
public async Task<IEnumerable<Reservation>> GetUserActiveReservations(int userId)
{
    return await _context.Reservations
        .Where(r => r.UserID == userId && r.EndDate >= DateTime.Today)
        .Include(r => r.Book)
        .Include(r => r.Addresses)  
        .Include(r => r.Card)    
        .OrderByDescending(r => r.StartDate)
        .ToListAsync();
}
    
    public async Task<bool> HasReservationConflict(string isbn, DateTime startDate, DateTime endDate)
    {
        return await _context.Reservations
            .Where(r => r.ISBN == isbn)
            .AnyAsync(r => 
                    (startDate >= r.StartDate && startDate <= r.EndDate) || // New start date falls within existing reservation
                    (endDate >= r.StartDate && endDate <= r.EndDate) || // New end date falls within existing reservation
                    (startDate <= r.StartDate && endDate >= r.EndDate) // New reservation completely encompasses existing one
            );
    }

    public async Task<int> GetSearchResultCount(string searchTerm, bool? isAvailable)
    {
        var query = _context.Books.AsQueryable();

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(b => b.BookTitle.Contains(searchTerm) || 
                                     b.BookAuthor.Contains(searchTerm) ||
                                     b.Publisher.Contains(searchTerm));
        }

        if (isAvailable.HasValue)
        {
            query = query.Where(b => b.IsAvailable == isAvailable.Value);
        }

        return await query.CountAsync();
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
        var activeReservations = await _context.Reservations
            .Where(r => r.UserID == userId && r.EndDate >= DateTime.Today)
            .Include(r => r.Book)
            .ToListAsync();

        return activeReservations
            .Select(r => r.Book)
            .Where(b => b != null)
            .Distinct()
            .ToList();
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