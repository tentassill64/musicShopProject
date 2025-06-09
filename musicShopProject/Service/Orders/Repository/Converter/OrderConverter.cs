using musicShopProject.Model.Addresses;
using musicShopProject.Model.Orders;
using musicShopProject.Model.Users;
using musicShopProject.Service.Orders.Repository.Model;

namespace musicShopProject.Service.Orders.Repository.Converter;

public static class OrderConverter
{
    public static Order ToOrder(this OrderDB orderDB, Address address, User user, OrderItem[] items)
    {
        return new Order(orderDB, address, user, items);
    }
}
