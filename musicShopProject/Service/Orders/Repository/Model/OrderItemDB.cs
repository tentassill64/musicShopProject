namespace musicShopProject.Service.Orders.Repository.Model
{
    public class OrderItemDB
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public Decimal ProductPrice { get; set; }
        public Boolean IsRemoved { get; set; }
        public DateTime CreatedDateTimeUtc { get; set; }
        public DateTime ModifiedDateTimeUtc { get; set; }
        public Guid ProductCategoryId { get; set; }
    }
}
