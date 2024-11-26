using musicShopProject.Model.Addresses;
using musicShopProject.Model.Orders;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Model.Products;
using musicShopProject.Model.Users;
using musicShopProject.Service.Orders.Repository;
using musicShopProject.Service.Orders.Repository.Model;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Orders;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUserService _userService;
    private readonly IProductService _productService;
    public OrderService(IOrderRepository orderRepository, IUserService userService, IProductService productService)
    {
        _orderRepository = orderRepository;
        _userService = userService;
        _productService = productService;
    }

    public PagedResult<Order> GetOrderPage(Int32 page, Int32 pageSize)
    {
        PagedResult<OrderDB> orderDBs = _orderRepository.GetOrderPage(page, pageSize);

        Guid[] addressesIds = orderDBs.Values.Select(order => order.AddressId).ToArray();

        Address[] addresses = _orderRepository.GetAddresses(addressesIds);

        Guid[] usersIds = orderDBs.Values.Select(order => order.ClientId).ToArray();

        User[] users = _userService.GetUsers(usersIds);

        List<Order> orders = new List<Order>();

        foreach (OrderDB orderDB in orderDBs.Values)
        {
            User? user = users.FirstOrDefault(x => x.Id == orderDB.ClientId);
            Address? address = addresses.FirstOrDefault(x => x.Id == orderDB.AddressId);
            OrderItemDB[] orderItemDBs = _orderRepository.GetOrderItems(orderDB.Id);

            List<OrderItem> orderItems = new List<OrderItem>();

            foreach(OrderItemDB orderItemDB in orderItemDBs)
            {
                Product? product = _productService.GetProduct(orderItemDB.ProductId);
                orderItems.Add(new(orderItemDB, product));
            }

            orders.Add(new(orderDB, address, user, orderItems.ToArray()));
        }

        return new PagedResult<Order>(orders, orderDBs.TotalRows);
    }

    public Result ChangeOrderState(OrderState orderState, Guid orderId)
    {
        _orderRepository.ChangeOrderState(orderState, orderId);

        return Result.Success();
    }
}
