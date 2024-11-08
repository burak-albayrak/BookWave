using backend.Models;
using backend.Models.DTOs;

namespace backend.Repositories;

public interface IRepository
{
    Task<IEnumerable<BookWithRatingDto>> SearchBooks(string searchTerm, int skip, int take);
    Task<int> GetSearchResultCount(string searchTerm);
    Task<Book> GetBookById(string isbn);
    Task<double> GetBookAverageRating(string isbn);
    Task<bool> CreateReservation(string isbn, int userId, DateTime startDate, DateTime endDate);
    Task<bool> CreateRating(string isbn, int userId, int bookRating);
    Task<IEnumerable<Book>> GetUserBooks(int userId);
    Task<bool> UpdateBookStatus(string isbn, bool isAvailable);
}