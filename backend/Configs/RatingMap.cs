using backend.Configs;
using CsvHelper.Configuration;
using backend.Models.DTOs;

public sealed class RatingMap : ClassMap<RatingImportDto>
{
    public RatingMap()
    {
        Map(m => m.RatingId).Name("RatingId");
        Map(m => m.ISBN).Name("ISBN");
        Map(m => m.UserID).Name("UserID");
        Map(m => m.StartDate).Name("StartDate");
        Map(m => m.EndDate).Name("EndDate");
    }
}