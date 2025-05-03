using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DTO;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        [HttpPost("add")]
        public IActionResult AddReview(ReviewDTO review) {
            return Ok("add review...");
        }

        [HttpGet("book/{bookId}")]
        public IActionResult GetReviewsForBook(int bookId) {
            return Ok("getting reviews for the book...");
        }
    }

}