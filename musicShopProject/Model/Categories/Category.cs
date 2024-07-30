namespace musicShopProject.Model.Categories;

public class Category
{
    public Guid Id { get; }
    public String Name { get; }

    public Category(Guid id, String name)
    {
        Id = id;
        Name = name;
    }
}
