using musicShopProject.Model.Addresses;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Model.Users;
using musicShopProject.Service.Orders.Repository.Model;

namespace musicShopProject.Model.Orders;

public class Order
{
    public Guid Id { get; }
    public Decimal Price { get; }
    public String ClientPhoneNumber { get; }
    public User Client { get; }
    public Address Address { get; }
    public DateTime? CompletedDateTimeUtc { get; }
    public DateTime CreatedDateTimeUtc { get;  }
    public OrderState State { get; }
    public Int32 OrderNumber { get; }
    public OrderItem[] OrderItems { get; }

    public Order(OrderDB db, Address address, User user, OrderItem[] items)
    {
        Id = db.Id;
        Price = db.Price;
        ClientPhoneNumber = db.ClientPhoneNumber;
        Client = user;
        Address = address;
        CompletedDateTimeUtc = db.CompletedDateTimeUtc;
        CreatedDateTimeUtc = db.CreatedDateTimeUtc;
        State = db.State;
        OrderNumber = db.OrderNumber;
        OrderItems = items;
    }
}
