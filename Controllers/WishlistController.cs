using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        [HttpPost("add")]
        public IActionResult AddToWishlist([FromBody] WishlistDTO item)
        {
            var result = _wishlistService.AddToWishlist(item);
            if (result)
                return Ok("Added to wishlist.");
            else
                return BadRequest("Item already exists in wishlist.");
        }

        [HttpGet("{userId}")]
        public IActionResult GetWishlist(int userId)
        {
            var wishlist = _wishlistService.GetWishlistByUser(userId);
            return Ok(wishlist);
        }

        [HttpDelete("remove/{userId}/{bookId}")]
        public IActionResult RemoveFromWishlist(int userId, int bookId)
        {
            var result = _wishlistService.RemoveFromWishlist(userId, bookId);
            if (result)
                return Ok("Removed from wishlist.");
            else
                return NotFound("Item not found in wishlist.");
        }
    }
}