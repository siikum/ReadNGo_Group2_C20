using Microsoft.EntityFrameworkCore;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;
using ReadNGo.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using ReadNGo_Group2_C20.DTO;

namespace ReadNGo.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly ReadNGoContext _context;

        // Constructor injection of the database context
        public AdminService(ReadNGoContext context)
        {
            _context = context;
        }

        // Add a new book to the catalog
        public bool AddBook(BookDTO bookDto)
        {
            try
            {
                var newBook = new Book
                {
                    Title = bookDto.Title,
                    Author = bookDto.Author,
                    Genre = bookDto.Genre,
                    Price = bookDto.Price,
                    Language = bookDto.Language,
                    Format = bookDto.Format,
                    Publisher = bookDto.Publisher,
                    PublicationDate = DateTime.SpecifyKind(bookDto.PublicationDate, DateTimeKind.Utc)
                };

                _context.Books.Add(newBook);
                _context.SaveChanges();

                Console.WriteLine($"Book '{newBook.Title}' added successfully.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("ADD BOOK ERROR: " + ex.Message);
                return false;
            }
        }

        // Edit existing book
        public bool EditBook(int bookId, BookDTO updatedBook)
        {
            try
            {
                var book = _context.Books.FirstOrDefault(b => b.Id == bookId);

                if (book == null)
                {
                    Console.WriteLine($"Book with ID {bookId} not found.");
                    return false;
                }

                book.Title = updatedBook.Title;
                book.Author = updatedBook.Author;
                book.Genre = updatedBook.Genre;
                book.Price = updatedBook.Price;
                book.Language = updatedBook.Language;
                book.Format = updatedBook.Format;
                book.Publisher = updatedBook.Publisher;

                //  Force UTC to fix PostgreSQL error
                book.PublicationDate = DateTime.SpecifyKind(updatedBook.PublicationDate, DateTimeKind.Utc);

                _context.SaveChanges();
                Console.WriteLine($"Book ID {bookId} updated successfully.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("EDIT BOOK ERROR: " + ex.Message);
                return false;
            }
        }




        // Delete a book
        public bool DeleteBook(int bookId)
        {
            try
            {
                var book = _context.Books.FirstOrDefault(b => b.Id == bookId);

                if (book == null)
                {
                    Console.WriteLine($"Book with ID {bookId} not found.");
                    return false;
                }

                _context.Books.Remove(book);
                _context.SaveChanges();

                Console.WriteLine($"Book ID {bookId} deleted successfully.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("DELETE BOOK ERROR: " + ex.Message);
                return false;
            }
        }


        // Setting a discount on a book
        public bool SetDiscount(int bookId, AdminSetDiscountDTO discountDto)
        {
            try
            {
                var book = _context.Books.FirstOrDefault(b => b.Id == bookId);

                if (book == null)
                {
                    Console.WriteLine($"Book with ID {bookId} not found.");
                    return false;
                }

                book.DiscountPercentage = discountDto.Percentage;
                book.IsOnSale = discountDto.IsOnSale;

                // You can add logic to store or handle startDate and endDate if needed
                // e.g., saving to a separate Discount table or fields in Book if they exist

                _context.SaveChanges();
                Console.WriteLine($"Discount of {discountDto.Percentage}% applied to Book ID {bookId}.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("SET DISCOUNT ERROR: " + ex.Message);
                return false;
            }
        }



        // Placeholder for creating an announcement
        public bool CreateAnnouncement(AnnouncementDTO announcement)
        {
            // TODO: Implement announcement creation logic
            return true;
        }
    }
}
