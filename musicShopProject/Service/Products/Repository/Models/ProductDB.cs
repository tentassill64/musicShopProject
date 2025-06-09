using musicShopProject.Model.Products;

namespace musicShopProject.Service.Products.Repository.Models;

public class ProductDB
{
    public Guid Id { get; set; }
    public String Name { get; set; }
    public String Description { get; set; }
    public Decimal Price { get; set; }
    public Decimal Weight { get; set; }
    public Guid ManufacturerId { get; set; }
    public Int32 Quantity { get; set; }
    public Guid CategoryId { get; set; }
    public String[] Images { get; set; }
    public ProductStatus Status { get; set; }
    public Boolean IsHidden { get; set; }
    public Guid CreatedUserId { get; set; }
    public Guid? ModifiedUserId { get; set; }
}