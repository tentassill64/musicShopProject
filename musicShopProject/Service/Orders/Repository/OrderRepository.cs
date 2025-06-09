using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using musicShopProject.Model.Addresses;
using musicShopProject.Model.Orders;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Model.Products;
using musicShopProject.Model.Users;
using musicShopProject.Service.Orders.Repository.Converter;
using musicShopProject.Service.Orders.Repository.Model;
using musicShopProject.Service.Products;
using musicShopProject.Service.Users;
using musicShopProject.Service.Users.Repository.Converters;
using musicShopProject.Service.Users.Repository.Models;
using musicShopProject.Tools.DataBase.Interfaces;
using musicShopProject.Tools.Types;
using Npgsql;

namespace musicShopProject.Service.Orders.Repository;

public class OrderRepository : IOrderRepository
{
    private readonly IMainConnector _mainConnector;

    private readonly IUserService _userService;

    private readonly IProductService _productsService;

    public OrderRepository(IMainConnector mainConnector, IProductService productService, IUserService userService)
    {
        _mainConnector = mainConnector;
        _userService = userService;
        _productsService = productService;
    }

    public Address GetOrderAddress(Guid addressId)
    {
        String query = @"select * from address
                         where id = @p_addressid";

        NpgsqlParameter[] parameters =
        {
            new("p_addressid", addressId)
        };

        Address address = _mainConnector.Get<AddressDB>(query, parameters).ToAddress();

        return address;
    }

    public Address[] GetAddresses(Guid[] addressesIds)
    {
        String query = @"select * from address 
                       where id = ANY(@p_addressesids)";

        NpgsqlParameter[] parameters =
        {
            new("p_addressesids", addressesIds)
        };

        Address[] addresses = _mainConnector
            .GetArray<AddressDB>(query, parameters)
            .Select(ad => ad.ToAddress())
            .ToArray();

        return addresses;
    }

    public OrderItemDB[] GetOrderItems(Guid orderId)
    {
        String query = @"select * from orderitems 
                         where orderid = @p_orderid";

        NpgsqlParameter[] parameters =
        {
            new("p_orderid", orderId)
        };

        OrderItemDB[] orderItemDBs = _mainConnector.GetArray<OrderItemDB>(query, parameters);

        return orderItemDBs;
    }

    public User GetOrderClient(Guid clientId)
    {
        String query = @"select * from users
                         where id = @p_clientid";

        NpgsqlParameter[] parameters =
        {
            new("p_clientid", clientId)
        };

        User user = _mainConnector.Get<UserDB>(query, parameters).ToUser();

        return user;
    }

    public void ChangeOrderState(OrderState orderState, Guid orderId)
    {
        String query = @"update orders 
                         set state = @p_orderstate
                         where id = @p_orderid";

        NpgsqlParameter[] parameters =
        {
            new("p_orderstate", (Int32)orderState),
            new("p_orderid", orderId)
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }

    public PagedResult<OrderDB> GetOrderPage(Int32 page, Int32 pageSize)
    {
        Int32 startIndex = (page - 1) * pageSize;

        String countQuery = @"SELECT COUNT(*) FROM orders WHERE isremoved = false";

        String dataQuery = @"SELECT * FROM orders
                         WHERE isremoved = false
                         ORDER BY createddatetimeutc DESC
                         OFFSET @p_startindex
                         LIMIT @p_pagesize";

        NpgsqlParameter[] parameters =
        {
            new("p_startindex", startIndex),
            new("p_pagesize", pageSize)
        };

        Int32 totalRows = _mainConnector.Get<Int32>(countQuery);

        OrderDB[] resultValues = _mainConnector.GetArray<OrderDB>(dataQuery, parameters);

        return new PagedResult<OrderDB>(resultValues, totalRows);
    }

    public PagedResult<OrderDB> GetOrderPage(Guid userId, Int32 page, Int32 pageSize)
    {
        Int32 startIndex = (page - 1) * pageSize;

        String countQuery = @"SELECT COUNT(*) FROM orders WHERE isremoved = false";

        String dataQuery = @"SELECT * FROM orders
                         WHERE isremoved = false AND clientid = @p_userid
                         ORDER BY createddatetimeutc DESC
                         OFFSET @p_startindex
                         LIMIT @p_pagesize";

        NpgsqlParameter[] parameters =
        {
            new("p_startindex", startIndex),
            new("p_pagesize", pageSize),
            new("p_userid", userId)
        };

        Int32 totalRows = _mainConnector.Get<Int32>(countQuery);

        OrderDB[] resultValues = _mainConnector.GetArray<OrderDB>(dataQuery, parameters);

        return new PagedResult<OrderDB>(resultValues, totalRows);
    }

    public void SaveOrder(OrderBlank.Validated validatedOrderBlank)
    {
        String orderQuery = @"Insert into orders (id, price, clientphonenumber, clientid, addressid, createddatetimeutc, completeddatetimeutc, state,
                           isremoved, ordernumber) values(@p_id, @p_price, @p_clientphonenumber, @p_clientid, @p_addressid, @p_timeNow, @p_completeddatetimeutc,
                               @p_state, false, @o_ordernumber) ON CONFLICT(id) DO update set price = @p_price, clientphonenumber = @p_clientphonenumber, clientid = @p_clientid,
                                    addressid = @p_addressid, completeddatetimeutc = @p_completeddatetimeutc, modifieddatetimeutc = @p_timeNow";

        NpgsqlParameter[] orderParameters =
        {
            new("p_id", validatedOrderBlank.Id),
            new("p_price", validatedOrderBlank.Price),
            new("p_clientphonenumber", validatedOrderBlank.ClientPhoneNumber),
            new("p_clientid", validatedOrderBlank.ClientId),
            new("p_addressid", validatedOrderBlank.AddressId),
            new("p_timeNow", DateTime.UtcNow),
            new("p_completeddatetimeutc", validatedOrderBlank.CompletedDateTimeUtc),
            new NpgsqlParameter("p_state", NpgsqlTypes.NpgsqlDbType.Integer) { Value = (int)validatedOrderBlank.State },
            new("o_ordernumber", validatedOrderBlank.OrderNumber)
        };

        _mainConnector.ExecuteNonQuery(orderQuery, orderParameters);

        String queryOrderItem = @"Insert into orderitems (id, orderId, productId, productprice, isremoved, createddatetimeutc, productcategoryid) values(
                      @p_id, @p_orderId, @p_productId, @p_productprice, false, @p_timeNow, @p_productcategoryid) ON CONFLICT(id) DO UPDATE SET 
                        orderId = @p_orderId, productId = @p_productId, productprice = @p_productprice, 
                    productcategoryid = @p_productcategoryid, modifieddatetimeutc = @p_timeNow";

        List<NpgsqlParameter> orderItemsParameters = new();

        validatedOrderBlank.ValidatedOrderItemBlanks.ToList().ForEach(validatedOrderItemBlank =>
        {

            orderItemsParameters.Add(new("p_id", validatedOrderItemBlank.Id));
            orderItemsParameters.Add(new("p_orderId", validatedOrderItemBlank.OrderId));
            orderItemsParameters.Add(new("p_productId", validatedOrderItemBlank.ProductId));
            orderItemsParameters.Add(new("p_productprice", validatedOrderItemBlank.ProductPrice));
            orderItemsParameters.Add(new("p_productcategoryid", validatedOrderItemBlank.ProductCategoryId));
            orderItemsParameters.Add(new("p_timeNow", DateTime.UtcNow));

            _mainConnector.ExecuteNonQuery(queryOrderItem, orderItemsParameters.ToArray());

            orderItemsParameters.Clear();
        });
    }

    public void SaveAddress(AddressBlank.Validated addressBlank)
    {
        String query = "Insert into address (id, city, street, home, apartment, createddatetimeutc, isremoved)" +
            "values(@p_id, @p_city, @p_street, @p_home, @p_apartment, @p_timeNow, false) ON CONFLICT(id) DO UPDATE SET " +
            "city = @p_city, street = @p_street, home = @p_home, apartment = @p_apartment, modifieddatetimeutc = @p_timeNow";

        NpgsqlParameter[] parameters =
       {
            new("p_id", addressBlank.Id),
            new("p_city", addressBlank.City),
             new("p_street", addressBlank.Street),
              new("p_home", addressBlank.Home),
               new("p_apartment", addressBlank.Apartment),
                new("p_timeNow", DateTime.UtcNow)

        };

        _mainConnector.ExecuteNonQuery(query, parameters);

    }

    public Order[] GetUserOrders(Guid userId)
    {
        String query = "Select * from orders WHERE clientid = @p_id and isremoved = false";

        NpgsqlParameter[] parameters =
        {
            new("p_id", userId)
        };

        OrderDB[] orderDBs = _mainConnector.GetArray<OrderDB>(query, parameters);

        User orderOwner = GetUser(userId)!;

        Address[] addreses = GetAddresses(orderDBs.Select(orderDB => orderDB.AddressId).ToArray());

        Product[] products = _productsService.GetProducts();

        return orderDBs.Select(orderDB => orderDB.ToOrder(
        addreses.FirstOrDefault(addres => addres.Id == orderDB.AddressId),
        orderOwner,
        GetOrderItems(orderDB.Id).Select(orderItemDB => orderItemDB
            .ToOrderItem(products.FirstOrDefault(product => product.Id == orderItemDB.ProductId)))
        .ToArray())).ToArray();
    }

    public User? GetUser(Guid userId)
    {
        String query = "Select * from users WHERE id = @p_id and isremoved = false";

        NpgsqlParameter[] parameters =
       {
            new("p_id", userId)
        };

        return _mainConnector.Get<UserDB>(query, parameters).ToUser();
    }
}
