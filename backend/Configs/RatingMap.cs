using backend.Configs;
using CsvHelper.Configuration;

public sealed class RatingMap : ClassMap<RatingImportDto>
{
    public RatingMap()
    {
        Map(m => m.ISBN).Name("ISBN");
        Map(m => m.UserID).Name("UserID");
        Map(m => m.BookRating).Name("BookRating");
    }
}