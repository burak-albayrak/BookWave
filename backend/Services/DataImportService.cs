using System.Globalization;
using backend.Configs;
using CsvHelper;
using backend.Configs;
using backend.Models;

public class DataImportService
{
    private readonly BookWaveContext _context;

    public DataImportService(BookWaveContext context)
    {
        _context = context;
    }

    public void ImportBooks(string filePath)
    {
        using var reader = new StreamReader(filePath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        var records = csv.GetRecords<Book>().ToList();
        _context.Books.AddRange(records);
        _context.SaveChanges();
    }

    public void ImportUsers(string filePath)
    {
        using var reader = new StreamReader(filePath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        var records = csv.GetRecords<User>().ToList();
        _context.Users.AddRange(records);
        _context.SaveChanges();
    }

    public void ImportRatings(string filePath)
    {
        using var reader = new StreamReader(filePath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        var records = csv.GetRecords<Rating>().ToList();
        _context.Ratings.AddRange(records);
        _context.SaveChanges();
    }
}