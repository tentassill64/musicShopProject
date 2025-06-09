using musicShopProject.Model.Orders;
using musicShopProject.Model.Products;
using musicShopProject.Service.Orders.Repository.Model;

namespace musicShopProject.Service.Orders.Repository.Converter
{
    public static class OrderItemsConverter
    {
        public static OrderItem ToOrderItem(this OrderItemDB orderItemDB, Product product)
        {
            return new OrderItem(orderItemDB, product);
        }
    }
}
