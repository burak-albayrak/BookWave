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
    Console.WriteLine($"Service: Starting rent process for ISBN: {isbn}, UserID: {userId}");

    try
    {
        // Validate dates
        if (startDate < DateTime.Today)
        {
            Console.WriteLine("Service: Start date is in the past");
            throw new ArgumentException("Start date cannot be in the past");
        }
        
        if (endDate <= startDate)
        {
            Console.WriteLine("Service: End date is not after start date");
            throw new ArgumentException("End date must be after start date");
        }
        
        var rentalPeriod = (endDate - startDate).TotalDays;
        Console.WriteLine($"Service: Rental period is {rentalPeriod} days");
        
        if (rentalPeriod > 30)
        {
            Console.WriteLine("Service: Rental period exceeds 30 days");
            throw new ArgumentException("Maximum rental period is 30 days");
        }

        var book = await _repository.GetBookById(isbn);
        Console.WriteLine($"Service: Book found: {book != null}, Available: {book?.IsAvailable}");
        
        if (book == null)
            throw new ArgumentException("Book not found");
        
        if (!book.IsAvailable)
            throw new ArgumentException("Book is not available for rent");

        // Check for reservation conflicts
        if (await _repository.HasReservationConflict(isbn, startDate, endDate))
            throw new ArgumentException("Book is already reserved for this period");

        // Create the reservation
        var reservationCreated = await _repository.CreateReservation(isbn, userId, startDate, endDate);
        if (!reservationCreated)
            throw new Exception("Failed to create reservation");

        // Update book availability
        var bookStatusUpdated = await _repository.UpdateBookStatus(isbn, false);
        if (!bookStatusUpdated)
            throw new Exception("Failed to update book status");

        Console.WriteLine("Service: Rent operation completed successfully");
        return true;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Service: Error during rent operation: {ex.Message}");
        throw;
    }
}
    
public async Task<IEnumerable<Book>> GetUserBooks(int userId)
{
    try
    {
        var books = await _repository.GetUserBooks(userId);
        Console.WriteLine($"Service: Found {books.Count()} books for user {userId}");
        return books;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Service: Error getting user books: {ex.Message}");
        throw;
    }
}
}