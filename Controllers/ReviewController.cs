using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReadNGo.DBContext;
using ReadNGo.DTO;
using ReadNGo_Group2_C20.Models;
using System.Linq;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ReadNGoContext _context;

        public ReviewController(ReadNGoContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public IActionResult AddReview([FromBody] ReviewDTO review)
        {
            // Check if user purchased the book
            var hasPurchased = _context.Orders
                .Include(o => o.OrderItems)
                .Any(o => o.UserId == review.UserId &&
                          o.OrderItems.Any(oi => oi.BookId == review.BookId));

            if (!hasPurchased)
            {
                return BadRequest(new { message = "You can only review books you've purchased." });
            }

            var newReview = new Review
            {
                BookId = review.BookId,
                UserId = review.UserId,
                Comment = review.Comment,
                Rating = review.Rating,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(newReview);
            _context.SaveChanges();

            return Ok(new { message = "Review submitted successfully." });
        }

        [HttpGet("book/{bookId}")]
        public IActionResult GetReviewsForBook(int bookId)
        {
            var reviews = _context.Reviews
                .Include(r => r.User)
                .Where(r => r.BookId == bookId)
                .Select(r => new
                {
                    r.Id,
                    r.Comment,
                    r.Rating,
                    r.CreatedAt,
                    User = r.User.FullName
                })
                .ToList();

            return Ok(reviews);
        }
    }
}
