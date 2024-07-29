namespace musicShopProject.Model.Products;

public class Product
{
    public Guid Id { get; }
    public String Name { get; }
    public String Description { get; }
    public ProductStatus Status { get; }
    public Decimal Price { get; }
    public Decimal Weight { get; }
    public Guid CategoryId { get; }
    public Boolean IsHidden { get; }
    public Int32 Quantity { get; }
    public String[] Images {  get; }

    public Product(
        Guid id, String name, String description, 
        ProductStatus status, Decimal price, Decimal weight,
        Guid categoryId, Boolean isHidden, Int32 quantity, String[] images)
    {
        Id = id;
        Name = name;
        Description = description;
        Status = status;
        Price = price;
        Weight = weight;
        CategoryId = categoryId;
        IsHidden = isHidden;
        Quantity = quantity;
        Images = images;
    }
}
