using musicShopProject.Model.Products;

namespace musicShopProject.Model.product;

public class Product
{
    public Guid Id { get; }
    public String Name { get; }
    public String Description { get; }
    public ProductStatus Status { get; }
    public Decimal Price { get; }
    public Decimal Weight { get; }
    public String Category { get; }

    public Product(
        Guid id, String name, String description, 
        String status, Decimal price, Decimal weight,
        String category
    )
    {
        Id = id;
        Name = name;
        Description = description;
        Status = status;
        Price = price;
        Weight = weight;
        Category = category;
    }
}
