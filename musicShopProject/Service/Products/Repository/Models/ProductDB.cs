using musicShopProject.Model.Products;

namespace musicShopProject.Service.Products.Repository.Models;

public class ProductDB
{
    public Guid Id { get; set; }
    public String Name { get; set; }
    public String Description { get; set; }
    //TODO убрать
    public DateTime CreatedDateTime { get; set; }
    public DateTime? UpdatedDateTime { get; set;}
    public Decimal Price { get; set; }
    public Decimal Weight { get; set; }
    public String Manufacturer { get; set; }
    public Int32 Quantity { get; set; }
    public Int32 CategoryId { get; set;}
    public String[]? Image {  get; set; }
    public ProductStatus Status { get; set; }
    public DateTime CreatedDateTimeUtc { get; set; }
    public DateTime? UpdatedDateTimeUtc { get; set; }
    public Boolean IsRemoved { get; set; }
    public Boolean IsHidden { get; set; }
}