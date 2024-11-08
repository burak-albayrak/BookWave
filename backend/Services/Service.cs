using backend.Models;
using backend.Models.DTOs;
using backend.Repositories;

namespace backend.Services;

public class Service : IService
{
    private readonly IRepository _repository;

    public Service(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<BookWithRatingDto>> SearchBooks(string searchTerm, int skip, int take)
    {
        return await _repository.SearchBooks(searchTerm, skip, take);
    }

    public async Task<int> GetSearchResultCount(string searchTerm)
    {
        return await _repository.GetSearchResultCount(searchTerm);
    }


    public async Task<Book> GetBookById(string isbn)
    {
        return await _repository.GetBookById(isbn);
    }
    public async Task<bool> RentBook(string isbn, int userId, DateTime startDate, DateTime endDate)
    {
        var book = await _repository.GetBookById(isbn);
        if (book == null || !book.IsAvailable)
            return false;

        var success = await _repository.CreateReservation(isbn, userId, startDate, endDate);
        if (success)
        {
            await _repository.UpdateBookStatus(isbn, false);
            return true;
        }
        return false;
    }

    public async Task<IEnumerable<Book>> GetUserBooks(int userId)
    {
        return await _repository.GetUserBooks(userId);
    }
}