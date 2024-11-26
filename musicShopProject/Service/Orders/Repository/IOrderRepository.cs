using musicShopProject.Model.Addresses;
using musicShopProject.Model.Orders;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Model.Users;
using musicShopProject.Service.Orders.Repository.Model;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Orders.Repository
{
    public interface IOrderRepository
    {
        PagedResult<OrderDB> GetOrderPage(Int32 page, Int32 pageSize);
        Address GetOrderAddress(Guid addressId);
        Address[] GetAddresses(Guid[] addressesIds);
        OrderItemDB[] GetOrderItems(Guid orderId);
        User GetOrderClient(Guid clientId);
        void ChangeOrderState(OrderState orderState, Guid orderId);
    }
}
