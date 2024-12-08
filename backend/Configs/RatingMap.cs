using backend.Models.DTOs;
using CsvHelper.Configuration;

namespace backend.Configs;

public sealed class RatingMap : ClassMap<RatingImportDto>
{
    public RatingMap()
    {
        Map(m => m.ISBN).Name("ISBN");
        Map(m => m.UserID).Name("UserID");
        Map(m => m.BookRating).Name("BookRating");
    }
}