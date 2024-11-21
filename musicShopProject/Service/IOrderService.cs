using musicShopProject.Model.Orders;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service;

public interface IOrderService
{
    PagedResult<Order> GetOrderPage(Int32 page, Int32 pageSize);
    Result ChangeOrderState(OrderState orderState, Guid orderId);
}
