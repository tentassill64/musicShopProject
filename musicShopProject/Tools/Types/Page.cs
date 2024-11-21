namespace musicShopProject.Tools.Types;

public class Page<T>
{
    public List<T> Values { get; set; }
    public Int32 TotalRows { get; set; }
}
