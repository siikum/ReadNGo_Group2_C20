using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReadNGo.DBContext;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;
using System.Linq;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }
        
        //POST 
        [HttpPost("add")]
        public IActionResult AddToCart([FromBody] CartItemDTO item)
        {
            var success = _cartService.AddToCart(item);
            if (!success) return BadRequest(new { message = "Invalid quantity." });
            return Ok(new { message = "Book added to cart successfully." });
        }

        // GET
        [HttpGet("{userId}")]
        public IActionResult ViewCart(int userId)
        {
            var cartItems = _cartService.GetCartItems(userId);

            if (cartItems == null || !cartItems.Any())
                return NotFound(new { message = "No items in cart for this user." });

            var result = cartItems.Select(item => new
            {
                BookId = item.BookId,
                Title = item.Book.Title,
                Author = item.Book.Author,
                Price = item.Book.Price,
                Quantity = item.Quantity,
                TotalPrice = item.Quantity * item.Book.Price
            });

            return Ok(result);
        }

        // DELETE 
        [HttpDelete("remove")]
        public IActionResult RemoveFromCart([FromQuery] int userId, [FromQuery] int bookId)
        {
            var success = _cartService.RemoveFromCart(userId, bookId);
            if (success)
                return Ok(new { message = "Book removed from cart." });
            else
                return NotFound(new { message = "Cart item not found." });
        }

    }
}
