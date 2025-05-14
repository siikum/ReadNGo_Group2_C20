using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            [FromQuery] string category = null,          
            [FromQuery] string genre = null,
            [FromQuery] string author = null,
            [FromQuery] string format = null,
            [FromQuery] string language = null,
            [FromQuery] string publisher = null,
            [FromQuery] bool? availableInLibrary = null,  
            [FromQuery] decimal? minPrice = null,         
            [FromQuery] decimal? maxPrice = null,         
            [FromQuery] double? minRating = null)         
        {
            var books = _bookService.FilterBooks(
                category,
                genre,
                author,
                format,
                language,
                publisher,
                availableInLibrary,
                minPrice,
                maxPrice,
                minRating);

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
        // GET: api/Book/authors
        [HttpGet("authors")]
        public ActionResult<IEnumerable<string>> GetDistinctAuthors()
        {
            var authors = _bookService.GetDistinctAuthors();
            return Ok(authors);
        }

        // GET: api/Book/genres
        [HttpGet("genres")]
        public ActionResult<IEnumerable<string>> GetDistinctGenres()
        {
            var genres = _bookService.GetDistinctGenres();
            return Ok(genres);
        }
        [HttpGet("languages")]
        public ActionResult<IEnumerable<string>> GetDistinctLanguages()
        {
            var languages = _bookService.GetDistinctLanguages();
            return Ok(languages);
        }

        // GET: api/Book/formats
        [HttpGet("formats")]
        public ActionResult<IEnumerable<string>> GetDistinctFormats()
        {
            var formats = _bookService.GetDistinctFormats();
            return Ok(formats);
        }
    }
}