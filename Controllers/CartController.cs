using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DTO;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        [HttpPost("add")]
        public IActionResult AddToCart(CartItemDTO item) {
            return Ok("Added to cart...");
        }

        [HttpGet("{userId}")]
        public IActionResult ViewCart(int userId) {
            return Ok("view the cart...");
        }

        [HttpDelete("remove/{bookId}")]
        public IActionResult RemoveFromCart(int bookId) {
            return Ok("remove fromm the cart...");
        }
    }

}