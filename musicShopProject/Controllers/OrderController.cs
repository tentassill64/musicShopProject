using Microsoft.AspNetCore.Mvc;
using musicShopProject.Model.Orders;
using musicShopProject.Model.Orders.enums;
using musicShopProject.Service;
using musicShopProject.Service.Orders;
using musicShopProject.Tools.Types;

namespace musicShopProject.Controllers
{
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService) 
        {
            _orderService = orderService;
        }

        [HttpGet("Get/Page")]
        public PagedResult<Order> GetOrderPage([FromQuery] Int32 page, Int32 pageSize)
        {
            return _orderService.GetOrderPage(page, pageSize);
        }

        public record ChangeOrderStateRequest(OrderState State, Guid OrderId);
        [HttpPost("Order/Change/State")]
        public Result ChangeOrderState([FromBody] ChangeOrderStateRequest changeOrderStateRequest)
        {
            return _orderService.ChangeOrderState(changeOrderStateRequest.State, changeOrderStateRequest.OrderId);
        }
    }
}
