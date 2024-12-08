using System.Globalization;
using backend.Models;
using backend.Models.DTOs;
using CsvHelper;

namespace backend.Configs;

public class DataImportService
{
    private readonly BookWaveContext _context;

    public DataImportService(BookWaveContext context)
    {
        _context = context;
    }

    public void ImportAll(string dataPath)
    {
        try
        {
            ImportBooks(Path.Combine(dataPath, "books.csv"));
            ImportUsers(Path.Combine(dataPath, "users.csv"));
            ImportRatings(Path.Combine(dataPath, "ratings.csv"));
            _context.SaveChanges();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error importing data: {ex.Message}");
            throw;
        }
    }

    private void ImportBooks(string filePath)
    {
        if (_context.Books.Any()) return;

        using var reader = new StreamReader(filePath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        var records = csv.GetRecords<Book>().ToList();
        _context.Books.AddRange(records);
    }

    private void ImportUsers(string filePath)
    {
        if (_context.Users.Any()) return;

        using var reader = new StreamReader(filePath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        var records = csv.GetRecords<User>().ToList();
        _context.Users.AddRange(records);
    }

    private void ImportRatings(string filePath)
    {
        if (_context.Ratings.Any()) return;

        using var reader = new StreamReader(filePath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

        csv.Context.RegisterClassMap<RatingMap>();
        var records = csv.GetRecords<RatingImportDto>().ToList();

        var ratings = records.Select(r => new Rating
        {
            UserID = r.UserID,
            ISBN = r.ISBN,
            BookRating = r.BookRating
        }).ToList();

        _context.Ratings.AddRange(ratings);
        _context.SaveChanges();
    }
}