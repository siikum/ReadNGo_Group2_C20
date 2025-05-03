using ReadNGo.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace ReadNGo.Services.Interfaces
{
    public interface IBookService
    {
        List<BookDTO> GetAllBooks();
        List<BookDTO> FilterBooks(string genre, string author, string format, string language, string publisher);
        List<BookDTO> SearchBooks(string query);
        List<BookDTO> SortBooks(string by);
        List<BookDTO> GetBooksByCategory(string type);
    }
}