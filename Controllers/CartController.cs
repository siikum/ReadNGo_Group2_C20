using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReadNGo.DBContext;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        private readonly ReadNGoContext _context;

        public CartController(ICartService cartService, ReadNGoContext context)
        {
            _cartService = cartService;
            _context = context; // <-- initialize here
        }

        //POST 
        [HttpPost("add")]
        public IActionResult AddToCart([FromBody] CartItemDTO item)
        {
            var success = _cartService.AddToCart(item);
            if (!success) return BadRequest(new { message = "Invalid quantity." });
            return Ok(new { message = "Book added to cart successfully." });
        }

        [HttpGet("{userId}")]
        public IActionResult ViewCart(int userId)
        {
            var cartItems = _cartService.GetCartItems(userId);
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
                return NotFound(new { message = "User not found." });

            if (cartItems == null || !cartItems.Any())
                return NotFound(new { message = "No items in cart for this user." });

            var result = new
            {
                User = new
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email
                },
                CartItems = cartItems.Select(item => new
                {
                    BookId = item.BookId,
                    Title = item.Book.Title,
                    Author = item.Book.Author,
                    Price = item.Book.Price,
                    Quantity = item.Quantity,
                    TotalPrice = item.Quantity * item.Book.Price
                })
            };

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

        [HttpPatch("update-quantity")]
        public IActionResult UpdateQuantity([FromBody] CartItemDTO item)
        {
            var success = _cartService.UpdateQuantity(item);
            if (success)
                return Ok(new { message = "Cart quantity updated." });
            else
                return NotFound(new { message = "Cart item not found." });
        }

        [HttpDelete("clear/{userId}")]
        public IActionResult ClearCart(int userId)
        {
            var success = _cartService.ClearCart(userId);
            if (success)
                return Ok(new { message = "Cart cleared." });
            else
                return NotFound(new { message = "Cart already empty or user not found." });
        }

    }
}