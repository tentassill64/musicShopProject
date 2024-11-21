namespace musicShopProject.Tools.Types;

public static class PagedResult
{
    public static PagedResult<T> Empty<T>()
    {
        return new PagedResult<T>(Array.Empty<T>(), 0);
    }

    public static PagedResult<T> Create<T>(IEnumerable<T> values, Int32 totalRows)
    {
        return new PagedResult<T>(values, totalRows);
    }
}

public class PagedResult<T>
{
    public List<T> Values { get; }

    public Int32 TotalRows { get; }

    public PagedResult(IEnumerable<T> values, Int32 totalRows)
    {
        Values = new List<T>(values ?? Array.Empty<T>());
        TotalRows = totalRows;
    }

    public void Deconstruct(out T[] values, out Int32 totalRows)
    {
        values = Values.ToArray();
        totalRows = TotalRows;
    }
}
