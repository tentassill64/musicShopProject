using musicShopProject.Model.Orders.enums;

namespace musicShopProject.Service.Orders.Repository.Model;

public class OrderDB
{
    public Guid Id { get; set; }
    public Decimal Price { get; set; }
    public String ClientPhoneNumber { get; set; }
    public Guid ClientId { get; set; }
    public Guid AddressId { get; set; }
    public DateTime CreatedDateTimeUtc { get; set; }
    public DateTime? ModifiedDateTimeUtc { get; set; }
    public DateTime? CompletedDateTimeUtc { get; set; }
    public OrderState State { get; set; }
    public Boolean IsRemoved { get; set; }
    public Int32 OrderNumber { get; set; }
}
