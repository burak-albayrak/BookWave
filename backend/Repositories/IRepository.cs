using backend.Models;
using backend.Models.DTOs;
using backend.Validations;

namespace backend.Repositories;

public interface IRepository
{
    Task<IEnumerable<BookWithRatingDto>> SearchBooks(string searchTerm, BookSortOption? sortOption, bool? isAvailable, int skip, int take);
    Task<int> GetSearchResultCount(string searchTerm, bool? isAvailable);
    Task<Book> GetBookById(string isbn);
    Task<double> GetBookAverageRating(string isbn);
    Task<IEnumerable<Reservation>> GetUserActiveReservations(int userId);
    Task<bool> HasReservationConflict(string isbn, DateTime startDate, DateTime endDate);
    Task<bool> CreateReservation(string isbn, int userId, DateTime startDate, DateTime endDate);
    Task<bool> CreateRating(string isbn, int userId, int bookRating);
    Task<IEnumerable<Book>> GetUserBooks(int userId);
    Task<bool> UpdateBookStatus(string isbn, bool isAvailable);
}