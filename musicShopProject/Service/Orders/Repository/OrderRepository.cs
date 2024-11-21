using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using musicShopProject.Model.Addresses;
using musicShopProject.Model.Orders;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Model.Users;
using musicShopProject.Service.Orders.Repository.Converter;
using musicShopProject.Service.Orders.Repository.Model;
using musicShopProject.Service.Users.Repository.Converters;
using musicShopProject.Service.Users.Repository.Models;
using musicShopProject.Tools.DataBase.Interfaces;
using musicShopProject.Tools.Types;
using Npgsql;

namespace musicShopProject.Service.Orders.Repository;

public class OrderRepository : IOrderRepository
{
    private readonly IMainConnector _mainConnector;
    public OrderRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
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
}
