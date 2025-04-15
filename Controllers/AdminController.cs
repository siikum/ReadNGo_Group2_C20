using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DTO;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        [HttpPost("add-book")]
        public IActionResult AddBook(BookDTO book) {
            return Ok("Adding books...");
        }

        [HttpPut("edit-book/{bookId}")]
        public IActionResult EditBook(int bookId, BookDTO updated) {
            return Ok("Editing books...");
        }

        [HttpDelete("delete-book/{bookId}")]
        public IActionResult DeleteBook(int bookId) {
            return Ok("Deleting books...");
        }

        [HttpPut("set-discount/{bookId}")]
        public IActionResult SetDiscount(int bookId, DiscountDTO discount) {
            return Ok("Setting Discount in books...");
        }

        [HttpPost("announcement")]
        public IActionResult CreateAnnouncement(AnnouncementDTO announcement) {
            return Ok("Published Announcement...");
        }
    }

}