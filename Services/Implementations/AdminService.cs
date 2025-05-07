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
        public async Task<bool> AddBook(AddBookDto bookDTO)
        {
            string? imagePath = null;

            if (bookDTO.Image != null && bookDTO.Image.Length > 0)
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "books");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(bookDTO.Image.FileName);
                var fullPath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await bookDTO.Image.CopyToAsync(stream);
                }

                imagePath = $"/images/books/{fileName}";
            }
            try
            {
                var newBook = new Book
                {
                    Title = bookDTO.Title,
                    Author = bookDTO.Author,
                    Genre = bookDTO.Genre,
                    Price = bookDTO.Price,
                    Language = bookDTO.Language,
                    Format = bookDTO.Format,
                    Publisher = bookDTO.Publisher,
                    PublicationDate = DateTime.SpecifyKind(bookDTO.PublicationDate, DateTimeKind.Utc),
                    IsOnSale = bookDTO.IsOnSale,
                    DiscountPercentage = bookDTO.DiscountPercentage,
                    DiscountStartDate = DateTime.SpecifyKind((DateTime)bookDTO.DiscountStartDate, DateTimeKind.Utc),
                    DiscountEndDate = DateTime.SpecifyKind((DateTime)bookDTO.DiscountEndDate, DateTimeKind.Utc),
                    Description = bookDTO.Description,
                    ISBN = bookDTO.ISBN,
                    StockQuantity = bookDTO.StockQuantity,
                    ImagePath = imagePath
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

                // Validation
                if (discountDto.StartDate >= discountDto.EndDate)
                {
                    Console.WriteLine("Invalid discount period: StartDate must be earlier than EndDate.");
                    return false;
                }

                if (discountDto.EndDate < DateTime.Now)
                {
                    Console.WriteLine("Invalid discount: EndDate must be in the future.");
                    return false;
                }

                // Apply discount
                book.DiscountPercentage = discountDto.Percentage;
                book.IsOnSale = discountDto.IsOnSale;
                book.DiscountStartDate = discountDto.StartDate;
                book.DiscountEndDate = discountDto.EndDate;

                _context.SaveChanges();
                Console.WriteLine($"Discount of {discountDto.Percentage}% applied to Book ID {bookId} from {discountDto.StartDate} to {discountDto.EndDate}.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("SET DISCOUNT ERROR: " + ex.Message);
                return false;
            }
        }

        public int ClearExpiredDiscounts()
        {
            var expiredBooks = _context.Books
                .Where(b => b.DiscountEndDate != null && b.DiscountEndDate < DateTime.Now)
                .ToList();

            foreach (var book in expiredBooks)
            {
                book.DiscountPercentage = null;
                book.IsOnSale = false;
                book.DiscountStartDate = null;
                book.DiscountEndDate = null;
            }

            _context.SaveChanges();
            Console.WriteLine($"Cleared discounts on {expiredBooks.Count} book(s).");

            return expiredBooks.Count;
        }





        // Creating an announcement
        public bool CreateAnnouncement(AnnouncementDTO announcementDto)
        {
            try
            {
                if (announcementDto.StartTime >= announcementDto.EndTime)
                    return false;

                var announcement = new Announcement
                {
                    Message = announcementDto.Message,
                    StartTime = announcementDto.StartTime,
                    EndTime = announcementDto.EndTime,
                    IsActive = true
                };

                _context.Announcements.Add(announcement);
                _context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool CreateStaff(StaffDTO staffDto)
        {
            // Email must end with @gmail.com
            if (string.IsNullOrEmpty(staffDto.Email) || !staffDto.Email.EndsWith("@gmail.com"))
                return false;

            // Password must be at least 8 characters, contain at least one digit and one special character
            if (string.IsNullOrEmpty(staffDto.Password) ||
                staffDto.Password.Length < 8 ||
                !staffDto.Password.Any(char.IsDigit) ||
                !staffDto.Password.Any(ch => !char.IsLetterOrDigit(ch)))
            {
                return false;
            }

            // Email uniqueness check
            if (_context.Staffs.Any(s => s.Email == staffDto.Email))
                return false;

            var staff = new Staff
            {
                FullName = staffDto.FullName,
                Email = staffDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(staffDto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Staffs.Add(staff);
            _context.SaveChanges();
            return true;
        }

        public bool CheckStaffEmailExists(string email)
        {
            return _context.Staffs.Any(s => s.Email == email);
        }



    }
}
