﻿using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ReadNGo_Group2_C20.Models;
using ReadNGo.DBContext;

namespace ReadNGo.Services.Implementations
{
    public class BookService : IBookService
    {
        private readonly ReadNGoContext _context;

        public BookService(ReadNGoContext context)
        {
            _context = context;
        }

        // Get all books
        public List<BookDTO> GetAllBooks()
        {
            return _context.Books
                .AsNoTracking()
                .Select(MapToDTO)
                .ToList();
        }

        // Get book by ID
        public BookDTO GetBookById(int id)
        {
            var book = _context.Books
                .AsNoTracking()
                .Include(b => b.Reviews)
                .FirstOrDefault(b => b.Id == id);

            return book != null ? MapToDTO(book) : null;
        }

        // Filter books by various criteria 
        public List<BookDTO> FilterBooks(
            string category = null, 
            string genre = null,
            string author = null,
            string format = null,
            string language = null,
            string publisher = null,
            bool? availableInLibrary = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            double? minRating = null)
        {
            var query = _context.Books
                .Include(b => b.Reviews)
                .AsQueryable();

            // Filter by category if provided
            if (!string.IsNullOrEmpty(category))
                query = query.Where(b => b.Category == category);

            if (!string.IsNullOrEmpty(genre))
                query = query.Where(b => b.Genre.Contains(genre));

            if (!string.IsNullOrEmpty(author))
                query = query.Where(b => b.Author.Contains(author));

            if (!string.IsNullOrEmpty(format))
                query = query.Where(b => b.Format.Contains(format));

            if (!string.IsNullOrEmpty(language))
                query = query.Where(b => b.Language.Contains(language));

            if (!string.IsNullOrEmpty(publisher))
                query = query.Where(b => b.Publisher.Contains(publisher));

            if (availableInLibrary.HasValue && availableInLibrary.Value)
                query = query.Where(b => b.StockQuantity > 0);

            if (minPrice.HasValue)
                query = query.Where(b => b.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(b => b.Price <= maxPrice.Value);

            if (minRating.HasValue)
                query = query.Where(b => b.Reviews.Any() &&
                    b.Reviews.Average(r => r.Rating) >= minRating.Value);

            return query
                .AsNoTracking()
                .Select(MapToDTO)
                .ToList();
        }

        // Search books by query (title, author, ISBN or description)
        public List<BookDTO> SearchBooks(string query)
        {
            if (string.IsNullOrEmpty(query))
                return GetAllBooks();

            string lowerQuery = query.ToLower();

            return _context.Books
                .Where(b =>
                    b.Title.ToLower().Contains(lowerQuery) ||
                    b.Author.ToLower().Contains(lowerQuery) ||
                    b.ISBN.ToLower().Contains(lowerQuery) ||
                    b.Description.ToLower().Contains(lowerQuery))
                .AsNoTracking()
                .Include(b => b.Reviews)
                .Select(MapToDTO)
                .ToList();
        }

        // Sort books by different criteria
        public List<BookDTO> SortBooks(string by)
        {
            var query = _context.Books.AsQueryable();

            if (string.IsNullOrEmpty(by))
                return query.AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList();

            return by.ToLower() switch
            {
                "title" => query.OrderBy(b => b.Title).AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList(),
                "title_desc" => query.OrderByDescending(b => b.Title).AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList(),
                "author" => query.OrderBy(b => b.Author).AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList(),
                "author_desc" => query.OrderByDescending(b => b.Author).AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList(),
                "price" => query.OrderBy(b => b.Price).AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList(),
                "price_desc" => query.OrderByDescending(b => b.Price).AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList(),
                "date" => query.OrderBy(b => b.PublicationDate).AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList(),
                "date_desc" => query.OrderByDescending(b => b.PublicationDate).AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList(),
                "arrival" => query.OrderBy(b => b.ArrivalDate).AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList(),
                "arrival_desc" => query.OrderByDescending(b => b.ArrivalDate).AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList(),
                _ => query.AsNoTracking().Include(b => b.Reviews).Select(MapToDTO).ToList()
            };
        }

        // Get books by category 
        public List<BookDTO> GetBooksByCategory(string type)
        {
            if (string.IsNullOrEmpty(type))
                return GetAllBooks();

            var now = DateTime.Now;
            var query = _context.Books.AsQueryable();

         
            var predefinedCategories = new[] {
                "Bestsellers",
                "Award Winners",
                "New Releases",
                "New Arrivals",
                "Coming Soon",
                "Deals",
                "All Books"
            };

            // First check if it's a direct category match
            if (predefinedCategories.Contains(type, StringComparer.OrdinalIgnoreCase))
            {
                return query
                    .Where(b => b.Category.ToLower() == type.ToLower())
                    .Include(b => b.Reviews)
                    .AsNoTracking()
                    .Select(MapToDTO)
                    .ToList();
            }

           
            return type.ToLower() switch
            {
                "bestsellers" => query
                    .Where(b => b.Category == "Bestsellers")
                    .Include(b => b.OrderItems)
                    .Include(b => b.Reviews)
                    .OrderByDescending(b => b.OrderItems.Count)
                    .Take(10)
                    .AsNoTracking()
                    .Select(MapToDTO)
                    .ToList(),

                "new_releases" => query
                    .Where(b => b.Category == "New Releases" ||
                               b.PublicationDate >= now.AddMonths(-3))
                    .Include(b => b.Reviews)
                    .AsNoTracking()
                    .Select(MapToDTO)
                    .ToList(),

                "new_arrivals" => query
                    .Where(b => b.Category == "New Arrivals" ||
                               b.ArrivalDate >= now.AddMonths(-1))
                    .Include(b => b.Reviews)
                    .AsNoTracking()
                    .Select(MapToDTO)
                    .ToList(),

                "coming_soon" => query
                    .Where(b => b.Category == "Coming Soon" ||
                               b.ArrivalDate > now)
                    .Include(b => b.Reviews)
                    .AsNoTracking()
                    .Select(MapToDTO)
                    .ToList(),

                "deals" => query
                    .Where(b => b.Category == "Deals" || b.IsOnSale)
                    .Include(b => b.Reviews)
                    .AsNoTracking()
                    .Select(MapToDTO)
                    .ToList(),

                "award_winners" => query
                    .Where(b => b.Category == "Award Winners")
                    .Include(b => b.Reviews)
                    .AsNoTracking()
                    .Select(MapToDTO)
                    .ToList(),

                _ => GetAllBooks()
            };
        }

      
        private static BookDTO MapToDTO(Book book)
        {
            var now = DateTime.UtcNow;

            bool isCurrentlyOnSale = book.IsOnSale &&
                                      book.DiscountStartDate.HasValue &&
                                      book.DiscountEndDate.HasValue &&
                                      book.DiscountStartDate <= now &&
                                      book.DiscountEndDate >= now;

            return new BookDTO
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                Genre = book.Genre,
                Language = book.Language,
                Format = book.Format,
                Publisher = book.Publisher,
                PublicationDate = book.PublicationDate,
                Category = book.Category,  
                ArrivalDate = book.ArrivalDate,  
                Price = book.Price,
                IsOnSale = isCurrentlyOnSale,
                DiscountPercentage = book.DiscountPercentage,
                DiscountStartDate = book.DiscountStartDate,
                DiscountEndDate = book.DiscountEndDate,
                Description = book.Description ?? $"Description for {book.Title}",
                ISBN = book.ISBN ?? "N/A",
                StockQuantity = book.StockQuantity,
                AverageRating = book.Reviews != null && book.Reviews.Any()
                    ? Math.Round(book.Reviews.Average(r => r.Rating), 1)
                    : 0,
                ReviewCount = book.Reviews?.Count ?? 0,
                ImagePath = book.ImagePath
            };
        }
        public List<string> GetDistinctAuthors()
        {
            return _context.Books
                .Where(b => !string.IsNullOrWhiteSpace(b.Author))  
                .Select(b => b.Author)
                .Distinct()
                .OrderBy(a => a)
                .ToList();
        }

        public List<string> GetDistinctGenres()
        {
            return _context.Books
                .Where(b => !string.IsNullOrWhiteSpace(b.Genre))  
                .Select(b => b.Genre)
                .Distinct()
                .OrderBy(g => g)
                .ToList();
        }
        public List<string> GetDistinctLanguages()
        {
            return _context.Books
                .Where(b => !string.IsNullOrWhiteSpace(b.Language))
                .Select(b => b.Language)
                .Distinct()
                .OrderBy(l => l)
                .ToList();
        }

        public List<string> GetDistinctFormats()
        {
            return _context.Books
                .Where(b => !string.IsNullOrWhiteSpace(b.Format))
                .Select(b => b.Format)
                .Distinct()
                .OrderBy(f => f)
                .ToList();
        }
    }
}