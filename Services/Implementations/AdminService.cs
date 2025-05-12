using Microsoft.EntityFrameworkCore;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;
using ReadNGo.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using ReadNGo_Group2_C20.DTO;
using ReadNGo_Group2_C20.Services.Interfaces;

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

        // Add a new book to the catalog - Updated to include Category and ArrivalDate
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
                    PublicationDate = DateTime.SpecifyKind(bookDto.PublicationDate, DateTimeKind.Utc),
                    Category = bookDto.Category,  // Added Category
                    ArrivalDate = DateTime.SpecifyKind(bookDto.ArrivalDate, DateTimeKind.Utc),  // Added ArrivalDate
                    IsOnSale = bookDto.IsOnSale,
                    DiscountPercentage = bookDto.DiscountPercentage,
                    DiscountStartDate = bookDto.DiscountStartDate.HasValue ? DateTime.SpecifyKind(bookDto.DiscountStartDate.Value, DateTimeKind.Utc) : null,
                    DiscountEndDate = bookDto.DiscountEndDate.HasValue ? DateTime.SpecifyKind(bookDto.DiscountEndDate.Value, DateTimeKind.Utc) : null,
                    Description = bookDto.Description,
                    ISBN = bookDto.ISBN,
                    StockQuantity = bookDto.StockQuantity,
                    ImagePath = bookDto.ImagePath
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

        public bool EditBookWithImage(int bookId, EditBookWithImageDTO updated, string? imagePath)
        {
            try
            {
                var book = _context.Books.FirstOrDefault(b => b.Id == bookId);
                if (book == null) return false;

                book.Title = updated.Title;
                book.Author = updated.Author;
                book.Genre = updated.Genre;
                book.Language = updated.Language;
                book.Format = updated.Format;
                book.Publisher = updated.Publisher;
                book.PublicationDate = DateTime.SpecifyKind(updated.PublicationDate, DateTimeKind.Utc);
                book.Category = updated.Category;  // Added Category
                book.ArrivalDate = DateTime.SpecifyKind(updated.ArrivalDate, DateTimeKind.Utc);  // Added ArrivalDate
                book.Price = updated.Price;
                book.IsOnSale = updated.IsOnSale;
                book.DiscountPercentage = updated.DiscountPercentage;
                book.DiscountStartDate = updated.DiscountStartDate;
                book.DiscountEndDate = updated.DiscountEndDate;
                book.Description = updated.Description;
                book.ISBN = updated.ISBN;
                book.StockQuantity = updated.StockQuantity;

                if (!string.IsNullOrEmpty(imagePath))
                {
                    book.ImagePath = imagePath;
                }

                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("EDIT BOOK WITH IMAGE ERROR: " + ex.Message);
                return false;
            }
        }

        // Delete a book (unchanged)
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

        // ... rest of the methods remain unchanged ...

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

                if (discountDto.StartDate >= discountDto.EndDate)
                {
                    Console.WriteLine("Invalid discount period: StartDate must be earlier than EndDate.");
                    return false;
                }

                var now = DateTime.UtcNow;

                // Reject discounts that are already expired
                if (discountDto.EndDate < now)
                {
                    Console.WriteLine("Cannot apply discount: EndDate is already in the past.");
                    return false;
                }

                // Apply discount fields
                book.DiscountPercentage = discountDto.Percentage;
                book.DiscountStartDate = discountDto.StartDate;
                book.DiscountEndDate = discountDto.EndDate;

                // Set IsOnSale only if current date is within discount range
                book.IsOnSale = now >= discountDto.StartDate && now <= discountDto.EndDate;

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

        // Clears expired discounts from all books
        public int ClearExpiredDiscounts()
        {
            var now = DateTime.UtcNow;

            var expiredBooks = _context.Books
                .Where(b => b.IsOnSale && b.DiscountEndDate.HasValue && b.DiscountEndDate < now)
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

        // Combines cleanup and discount setting in one call
        public bool SetDiscountWithAutoCleanup(int bookId, AdminSetDiscountDTO discountDto)
        {
            // Step 1: Clear expired discounts globally
            ClearExpiredDiscounts();

            // Step 2: Apply new discount to the specified book
            return SetDiscount(bookId, discountDto);
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
                    Title = announcementDto.Title,
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

        public List<AnnouncementDTO> GetAllAnnouncements()
        {
            var now = DateTime.UtcNow;
            return _context.Announcements
                .Where(a => a.StartTime <= now && a.EndTime >= now && a.IsActive)
                .OrderByDescending(a => a.StartTime)
                .Select(a => new AnnouncementDTO
                {
                    Title = a.Title,
                    Message = a.Message,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime
                })
                .ToList();
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