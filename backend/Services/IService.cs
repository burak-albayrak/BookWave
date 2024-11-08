using backend.Models;
using backend.Models.DTOs;

namespace backend.Services;

public interface IService
{
    Task<IEnumerable<BookWithRatingDto>> SearchBooks(string searchTerm, int skip, int take);
    Task<int> GetSearchResultCount(string searchTerm);

    Task<Book> GetBookById(string isbn);
    Task<bool> RentBook(string isbn, int userId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<Book>> GetUserBooks(int userId);
}