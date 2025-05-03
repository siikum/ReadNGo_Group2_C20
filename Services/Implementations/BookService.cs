using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Implementations
{
    public class BookService : IBookService
    {
        public List<BookDTO> GetAllBooks() => new();
        public List<BookDTO> FilterBooks(string genre, string author, string format, string language, string publisher) => new();
        public List<BookDTO> SearchBooks(string query) => new();
        public List<BookDTO> SortBooks(string by) => new();
        public List<BookDTO> GetBooksByCategory(string type) => new();
    }
}