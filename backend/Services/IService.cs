using backend.Models;

namespace backend.Services;

public interface IService
{
    Task<IEnumerable<Book>> SearchBooks(string searchTerm);
    Task<Book> GetBookById(string isbn);
    Task<bool> RentBook(string isbn, int userId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<Book>> GetUserBooks(int userId);
}