using backend.Models;

namespace backend.Repositories;

public interface IRepository
{
    Task<IEnumerable<Book>> SearchBooks(string searchTerm);
    Task<Book> GetBookById(string isbn);
    Task<bool> CreateReservation(string isbn, int userId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<Book>> GetUserBooks(int userId);
    Task<bool> UpdateBookStatus(string isbn, bool isAvailable);
}