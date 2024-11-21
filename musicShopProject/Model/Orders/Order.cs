using musicShopProject.Model.Addresses;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Model.Users;
using musicShopProject.Service.Orders.Repository.Model;

namespace musicShopProject.Model.Orders;

public class Order
{
    public Guid Id { get; set; }
    public Decimal Price { get; set; }
    public String ClientPhoneNumber { get; set; }
    public User Client { get; set; }
    public Address Address { get; set; }
    public DateTime? CompletedDateTimeUtc { get; set; }
    public DateTime CreatedDateTimeUtc { get; set; }
    public OrderState State { get; set; }
    public Int32 OrderNumber { get; set; }

    public Order(OrderDB db, Address address, User user)
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
    }
}
