namespace musicShopProject.Model.Products;

public class Product
{
    public Guid Id { get; }
    public String Name { get; }
    public String Description { get; }
    public ProductStatus Status { get; }
    public Decimal Price { get; }
    public Decimal Weight { get; }
    //TODO Guid вместо int32
    public Int32 CategoryId { get; }
    public Boolean IsHidden { get; }

    //    public Int32? Quantity { get; set; }
    //    public String[]? Image {  get; set; }

    public Product(
        Guid id, String name, String description, 
        ProductStatus status, Decimal price, Decimal weight,
        Int32 categoryId, Boolean isHidden)
    {
        Id = id;
        Name = name;
        Description = description;
        Status = status;
        Price = price;
        Weight = weight;
        CategoryId = categoryId;
        IsHidden = isHidden;
    }
}
