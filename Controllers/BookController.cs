using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DTO;


namespace ReadNGo_Group2_C20.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        [HttpGet("all")]
        public IActionResult GetAllBooks()
        {
            return Ok("Getting all books..."); // temporary response
        }

        [HttpGet("filter")]
        public IActionResult FilterBooks([FromQuery] string genre, string author, string format, string language, string publisher)
        {
            return Ok("Filtering books...");
        }

        [HttpGet("search")]
        public IActionResult SearchBooks([FromQuery] string query)
        {
            return Ok("Searching books...");
        }

        [HttpGet("sort")]
        public IActionResult SortBooks([FromQuery] string by)
        {
            return Ok("Sorting books...");
        }

        [HttpGet("categories/{type}")]
        public IActionResult GetBooksByCategory(string type)
        {
            return Ok($"Books from category: {type}");
        }
    }
}