using ReadNGo.DTO;
using System;
using System.Collections.Generic;

namespace ReadNGo.Services.Interfaces
{
    public interface IBookService
    {
        List<BookDTO> GetAllBooks();
        BookDTO GetBookById(int id);

        List<BookDTO> FilterBooks(
            string genre = null,
            string author = null,
            string format = null,
            string language = null,
            string publisher = null,
            bool? availableInLibrary = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            double? minRating = null
        );

        List<BookDTO> SearchBooks(string query);
        List<BookDTO> SortBooks(string by);
        List<BookDTO> GetBooksByCategory(string type);
    }
}
