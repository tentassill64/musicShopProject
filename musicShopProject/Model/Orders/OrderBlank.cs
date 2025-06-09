using musicShopProject.Model.Orders.enums;

namespace musicShopProject.Model.Orders;

public partial class OrderBlank
{
    public Guid? Id { get; set; }
    public Decimal? Price { get; set; }
    public String? ClientPhoneNumber { get; set; }
    public Guid? ClientId { get; set; }
    public Guid? AddressId { get; set; }
    public DateTime? CompletedDateTimeUtc { get; set; }
    public DateTime? CreatedDateTimeUtc { get; set; }
    public OrderState? State { get; set; }
    public Int32? OrderNumber { get; set; }
    public OrderItemBlank[] OrderItems { get; set; }
}

public partial class OrderBlank
{
    public class Validated
    {
        public Guid? Id { get; }
        public Decimal? Price { get; }
        public String? ClientPhoneNumber { get; }
        public Guid? ClientId { get; }
        public Guid? AddressId { get; }
        public DateTime? CompletedDateTimeUtc { get; }
        public DateTime? CreatedDateTimeUtc { get; }
        public OrderState? State { get; }
        public Int32? OrderNumber { get; }
        public OrderItemBlank.Validated[] ValidatedOrderItemBlanks { get; }

        public Validated(Guid id, Decimal price, String clientPhoneNumber, Guid clientId, Guid addresId,
            DateTime completedDateTimeUtc, DateTime createdDateTimeUtc, OrderState state, Int32 orderNumber, OrderItemBlank.Validated[] validatedOrderItemBlanks)
        {
            Id = id;
            Price = price;
            ClientPhoneNumber = clientPhoneNumber;
            ClientId = clientId;
            AddressId = addresId;
            CompletedDateTimeUtc = completedDateTimeUtc;
            CreatedDateTimeUtc = createdDateTimeUtc;
            State = state;
            OrderNumber = orderNumber;
            ValidatedOrderItemBlanks = validatedOrderItemBlanks;
        }
    }
}
