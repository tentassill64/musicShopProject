using musicShopProject.Model.Addresses;
using musicShopProject.Model.Orders;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Model.Users;
using musicShopProject.Service.Orders.Repository;
using musicShopProject.Service.Orders.Repository.Model;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Orders;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public PagedResult<Order> GetOrderPage(Int32 page, Int32 pageSize)
    {
        PagedResult<OrderDB> orderDBs = _orderRepository.GetOrderPage(page, pageSize);

        List<Order> orders = new List<Order>();

        foreach (OrderDB orderDB in orderDBs.Values)
        {
            Address address = _orderRepository.GetOrderAddress(orderDB.AddressId);
            User user = _orderRepository.GetOrderClient(orderDB.ClientId);

            orders.Add(new(orderDB, address, user));
        }

        return new PagedResult<Order>(orders, orderDBs.TotalRows);
    }

    public Result ChangeOrderState(OrderState orderState, Guid orderId)
    {
        _orderRepository.ChangeOrderState(orderState, orderId);

        return Result.Success();
    }
}
