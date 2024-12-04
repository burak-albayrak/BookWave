using backend.Models;
using backend.Models.DTOs;
using backend.Validations;

namespace backend.Services;

public interface IService
{
    Task<IEnumerable<BookWithRatingDto>> SearchBooks(string searchTerm, BookSortOption? sortOption, bool? isAvailable, int skip, int take);
    Task<int> GetSearchResultCount(string searchTerm, bool? isAvailable);

    Task<Book> GetBookById(string isbn);
    Task<bool> RentBook(string isbn, int userId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<Book>> GetUserBooks(int userId);
}