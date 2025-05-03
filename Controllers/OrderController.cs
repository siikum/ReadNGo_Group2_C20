using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.DTO;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("create")]
        public IActionResult CreateOrder([FromBody] OrderCreateDTO order)
            {
            var result = _orderService.CreateOrder(order);
            if (result)
            {
                return Ok("Order created successfully.");
            }
            return BadRequest("Failed to create order.");
        }


        [HttpPost("cancel/{orderId}")]
        public IActionResult CancelOrder(int orderId)
        {
            var result = _orderService.CancelOrder(orderId);
            if (result)
            {
                return Ok($"Order {orderId} cancelled successfully.");
            }
            return NotFound($"Order {orderId} not found or already cancelled.");
        }


        [HttpGet("user/{userId}")]
        public IActionResult GetOrdersByUser(int userId)
        {
            var orders = _orderService.GetOrdersByUser(userId);
            if (orders.Count == 0)
                return NotFound($"No orders found for user ID {userId}");

            return Ok(orders);
        }


        [HttpGet("check-discount/{userId}")]
        public IActionResult CheckDiscount(int userId)
        {
            var result = _orderService.CheckDiscount(userId);
            return Ok(result);
        }



        [HttpPost("apply-discount")]
        public IActionResult ApplyDiscount([FromBody] ApplyDiscountDTO discount)
        {
            var result = _orderService.ApplyDiscount(discount);
            return Ok(result);
        }


    }
}
