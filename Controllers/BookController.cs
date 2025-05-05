using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;

namespace ReadNGo_Group2_C20.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        // GET: api/Book/all
        [HttpGet("all")]
        public ActionResult<IEnumerable<BookDTO>> GetAllBooks()
        {
            var books = _bookService.GetAllBooks();
            return Ok(books);
        }

        // GET: api/Book/5
        [HttpGet("{id}")]
        public ActionResult<BookDTO> GetBookById(int id)
        {
            var book = _bookService.GetBookById(id);

            if (book == null)
            {
                return NotFound($"Book with ID {id} not found");
            }

            return Ok(book);
        }

        // GET: api/Book/filter
        [HttpGet("filter")]
        public ActionResult<IEnumerable<BookDTO>> FilterBooks(
            [FromQuery] string genre = null,
            [FromQuery] string author = null,
            [FromQuery] string format = null,
            [FromQuery] string language = null,
            [FromQuery] string publisher = null)
        {
            var books = _bookService.FilterBooks(genre, author, format, language, publisher);
            return Ok(books);
        }

        // GET: api/Book/search
        [HttpGet("search")]
        public ActionResult<IEnumerable<BookDTO>> SearchBooks([FromQuery] string query)
        {
            var books = _bookService.SearchBooks(query);
            return Ok(books);
        }

        // GET: api/Book/sort
        [HttpGet("sort")]
        public ActionResult<IEnumerable<BookDTO>> SortBooks([FromQuery] string by = "title")
        {
            var books = _bookService.SortBooks(by);
            return Ok(books);
        }

        // GET: api/Book/categories/{type}
        [HttpGet("categories/{type}")]
        public ActionResult<IEnumerable<BookDTO>> GetBooksByCategory(string type)
        {
            var books = _bookService.GetBooksByCategory(type);
            return Ok(books);
        }
    }
}