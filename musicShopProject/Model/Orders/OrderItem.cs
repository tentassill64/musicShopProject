using musicShopProject.Model.Products;
using musicShopProject.Service.Orders.Repository.Model;

namespace musicShopProject.Model.Orders;

public partial class OrderItem
{
    public Guid? Id { get; }
    public Guid? OrderId { get; }
    public Product? Product { get; }
    public Decimal? ProductPrice { get; }
    public Guid? ProductCategoryId { get; set; }

    public OrderItem(OrderItemDB db, Product product)
    {
        Id = db.Id;
        OrderId = db.OrderId;
        Product = product;
        ProductPrice = db.ProductPrice;
        ProductCategoryId = db.ProductCategoryId;
    }
}

