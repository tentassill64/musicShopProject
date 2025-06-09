namespace musicShopProject.Model.Orders;

public partial class OrderItemBlank
{
    public Guid? Id { get; set; }
    public Guid? OrderId { get; set; }
    public Guid? ProductId { get; set; }
    public Decimal? ProductPrice { get; set; }
    public Guid? ProductCategoryId { get; set; }

}

public partial class OrderItemBlank
{
    public class Validated
    {
        public Guid Id { get; }
        public Guid OrderId { get; }
        public Guid ProductId { get; }
        public Decimal ProductPrice { get; }
        public Guid ProductCategoryId { get; }

        public Validated(Guid id, Guid orderId, Guid productId, Decimal productPrice, Guid productCategoryId)
        {
            Id = id;
            OrderId = orderId;
            ProductId = productId;
            ProductPrice = productPrice;
            ProductCategoryId = productCategoryId;
        }
    }
}
