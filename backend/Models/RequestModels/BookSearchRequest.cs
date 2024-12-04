using backend.Validations;

namespace backend.Models.RequestModels;

public class BookSearchRequest
{
    public string SearchTerm { get; set; }
    public BookSortOption? SortOption { get; set; }
    public bool? IsAvailable { get; set; }
    public int Page { get; set; }
}