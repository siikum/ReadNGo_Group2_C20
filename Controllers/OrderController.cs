using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DTO;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        [HttpPost("create")]
        public IActionResult CreateOrder(OrderDTO order) {
            return Ok("order created hehe...");
        }

        [HttpPost("cancel/{orderId}")]
        public IActionResult CancelOrder(int orderId) {
            return Ok("order canceled...");
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetOrdersByUser(int userId) {
            return Ok("Get orders by the users yay...");
        }

        [HttpGet("check-discount/{userId}")]
        public IActionResult CheckDiscount(int userId) {
            return Ok("hmm check discounts...");
        }

        [HttpPost("apply-discount")]
        public IActionResult ApplyDiscount(DiscountDTO discount) {
            return Ok("yeaa apply discounts...");
        }
    }

}