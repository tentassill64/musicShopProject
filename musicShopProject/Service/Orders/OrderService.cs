using musicShopProject.Model.Addresses;
using musicShopProject.Model.Orders;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Model.Users;
using musicShopProject.Service.Orders.Repository;
using musicShopProject.Service.Orders.Repository.Model;
using musicShopProject.Tools.Extensions;
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
        List<Order> orders = orderDBs.Values.Select(CreateOrderFromDB).ToList();

        return new PagedResult<Order>(orders, orderDBs.TotalRows);
    }

    private Order CreateOrderFromDB(OrderDB orderDB)
    {
        Address? address = _orderRepository.GetAddresses(new[] { orderDB.AddressId }).FirstOrDefault();
        User? user = _userService.GetUsers(new[] { orderDB.ClientId }).FirstOrDefault();
        OrderItem[]? orderItems = GetOrderItemsWithProducts(orderDB.Id);

        return new Order(orderDB, address, user, orderItems);
    }

    private OrderItem[] GetOrderItemsWithProducts(Guid orderId)
    {
        return _orderRepository.GetOrderItems(orderId)
            .Select(item => new OrderItem(item, _productService.GetProduct(item.ProductId)))
            .ToArray();
    }

    public Result ChangeOrderState(OrderState orderState, Guid orderId)
    {
        _orderRepository.ChangeOrderState(orderState, orderId);

        return Result.Success();
    }

    public PagedResult<Order> GetOrderPage(Int32 page, Int32 pageSize, Guid userId)
    {
        PagedResult<OrderDB> orderDBs = _orderRepository.GetOrderPage(userId, page, pageSize);
        List<Order> orders = orderDBs.Values.Select(CreateOrderFromDB).ToList();

        return new PagedResult<Order>(orders, orderDBs.TotalRows);
    }

    public Result SaveOrder(OrderBlank? orderBlank)
    {
        Result validatedResult = OrderBlankPreProcess(orderBlank, out OrderBlank.Validated validatedOrderBlank);
        if (!validatedResult.IsSuccess) return Result.Fail(validatedResult.Errors.FirstOrDefault());

        _orderRepository.SaveOrder(validatedOrderBlank);

        return Result.Success();
    }

    private Result OrderBlankPreProcess(OrderBlank? orderBlank, out OrderBlank.Validated validatedOrderBlank)
    {
        validatedOrderBlank = null;

        if (orderBlank.Id is not { } id) throw new Exception("Id заказа при сохранении пришло Null");

        if (orderBlank.Price is not { } price) throw new Exception("Price пришел Null");

        if (price < 0 || price == 0) return Result.Fail("Нельзя заказать на 0 рублей");

        if (orderBlank.ClientPhoneNumber is not { } clientPhoneNumber) throw new Exception("Телефон клиента пришел Null");

        if (clientPhoneNumber.IsNullOrWhiteSpace()) return Result.Fail("Номер телефона обязателен к заполнению");

        if (orderBlank.ClientId is not { } clientId) throw new Exception("Id пользователя пришло Null");

        if (orderBlank.AddressId is not { } addresId) throw new Exception("Id адреса пришло Null");

        if (orderBlank.CompletedDateTimeUtc is not { } completeDateTimeUtc) throw new Exception("Время завершения пришло null");

        if (orderBlank.CreatedDateTimeUtc is not { } createDateTime) throw new Exception("Время создание пришло Null");

        if (orderBlank.State is not { } state) throw new Exception("Статус заказа пришел Null");

        if (orderBlank.OrderNumber is not { } orderNumber) throw new Exception("Сумма заказа пришло Null");

        if (orderBlank.OrderItems is not { } orderItemsBlanks) throw new Exception("Товары заказа пришли Null");

        Result[] itemBlanksValidatedResults = orderItemsBlanks.Select(orderItemBlank =>
        {
            if (orderItemBlank.Id is not { } id) throw new Exception("Id элемента заказа пришло null");

            if (orderItemBlank.OrderId is not { } orderId) throw new Exception("Id заказа пришел null");

            if (orderItemBlank.ProductId is not { } productId) throw new Exception("Продукт заказа пришел Null");

            if (orderItemBlank.ProductPrice is not { } price) throw new Exception("Price Товара пришел Null");

            if (price < 0 || price == 0) return Result.Fail("Цена товара не может быть 0");

            if (orderItemBlank.ProductCategoryId is not { } productCategoryId) throw new Exception("Категория товара пришло Null");

            return Result.Success();
        }).ToArray();

        if (itemBlanksValidatedResults.FirstOrDefault(itemBlankValidatedResult => itemBlankValidatedResult.IsSuccess == false) is not null)
        {
            return Result.Fail(itemBlanksValidatedResults.First(itemBlankValidatedResult => itemBlankValidatedResult.IsSuccess == false).Errors);
        }

        OrderItemBlank.Validated[] validatedOrderItemsBlanks = orderBlank.OrderItems.Select(orderItemBlank =>
        {
            return new OrderItemBlank.Validated(orderItemBlank.Id.Value, orderItemBlank.OrderId.Value,
                orderItemBlank.ProductId.Value, orderItemBlank.ProductPrice.Value, orderItemBlank.ProductCategoryId.Value);
        }).ToArray();

        validatedOrderBlank = new OrderBlank.Validated(id, price, clientPhoneNumber, clientId, addresId,
            completeDateTimeUtc, createDateTime, state, orderNumber, validatedOrderItemsBlanks);

        return Result.Success();
    }

    public Order[] GetUserOrders(Guid? userId)
    {
        if (userId is not { } id) throw new Exception("Id пришел null");

        return _orderRepository.GetUserOrders(id);
    }

    public Result SaveAddress(AddressBlank? addressBlank)
    {
        Result validatedResult = AddressBlankPreProcess(addressBlank, out AddressBlank.Validated validatedAdressBlank);
        if (!validatedResult.IsSuccess) return Result.Fail(validatedResult.Errors);

        _orderRepository.SaveAddress(validatedAdressBlank);

        return Result.Success();
    }

    private Result AddressBlankPreProcess(AddressBlank? addressBlank, out AddressBlank.Validated validatedAdressBlank)
    {
        validatedAdressBlank = null;

        if (addressBlank.Id is not { } id) throw new Exception("Id при сохранении адресса Null");

        if (addressBlank.Street is not { } street) throw new Exception("Street пришел Null");

        if (street.IsNullOrWhiteSpace()) return Result.Fail("Улица обязательна к заполнению");

        if (addressBlank.City is not { } city) throw new Exception("City обязателен к заполнению");

        if (city.IsNullOrWhiteSpace()) return Result.Fail("Город обязателен к заполнению");

        if (addressBlank.Home is not { } home) throw new Exception("Home пришел Null");

        if (home.IsNullOrWhiteSpace()) return Result.Fail("Номер дома обязатален к заполнению");

        if (addressBlank.Apartment is not { } apartment) throw new Exception("Address пришел NUll");

        if (apartment.IsNullOrWhiteSpace()) return Result.Fail("Номер квартиры обязателен к заполнению");

        validatedAdressBlank = new AddressBlank.Validated(id, street, city, home, apartment);

        return Result.Success();
    }
}
