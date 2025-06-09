using musicShopProject.Model.Addresses;
using musicShopProject.Model.Orders;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service;

public interface IOrderService
{
    Result SaveOrder(OrderBlank? orderBlank);
    Result SaveAddress(AddressBlank? addressBlank);
    PagedResult<Order> GetOrderPage(Int32 page, Int32 pageSize);
    PagedResult<Order> GetOrderPage(Int32 page, Int32 pageSize, Guid userId);
    Result ChangeOrderState(OrderState orderState, Guid orderId);
    Order[] GetUserOrders(Guid? userId);
}
