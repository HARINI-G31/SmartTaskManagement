namespace SmartTaskManagement.Common;

public class PagedResponse<T>
{
    public PagedResponse(
        IEnumerable<T>? items,
        int currentPage,
        int pageSize,
        int totalCount)
    {
        Items = items?.ToArray() ?? [];
        CurrentPage = Math.Max(1, currentPage);
        PageSize = Math.Max(0, pageSize);
        TotalCount = Math.Max(0, totalCount);
    }

    public IReadOnlyCollection<T> Items { get; }

    public int CurrentPage { get; }

    public int PageSize { get; }

    public int TotalCount { get; }

    public int TotalPages => PageSize == 0
        ? 0
        : (int)Math.Ceiling((double)TotalCount / PageSize);

    public bool HasPreviousPage => CurrentPage > 1 && TotalPages > 0;

    public bool HasNextPage => CurrentPage < TotalPages;
}
