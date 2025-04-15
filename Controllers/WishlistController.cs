using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DTO;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        [HttpPost("add")]
        public IActionResult AddToWishlist(WishlistDTO item) {
            return Ok("add to wishlist yahoo...");
        }

        [HttpGet("{userId}")]
        public IActionResult GetWishlist(int userId) {
            return Ok("Get wish list yay...");
        }

        [HttpDelete("remove/{bookId}")]
        public IActionResult RemoveFromWishlist(int bookId) {
            return Ok("remove from the wishlist...");
        }
    }

}