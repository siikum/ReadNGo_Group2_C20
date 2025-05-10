using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReadNGo.DTO;
using ReadNGo.Services.Implementations;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.DTO;
using ReadNGo_Group2_C20.Models;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        // Constructor to inject IAdminService
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // POST: api/Admin/add-book
        [Authorize(Roles = "Admin")]
        [HttpPost("add-book-with-image")]
        [Consumes("multipart/form-data")]
        public IActionResult AddBookWithImage([FromForm] BookWithImageDTO bookWithImage)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Generate unique file name
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(bookWithImage.Image.FileName);
            var imagePath = Path.Combine("wwwroot", "images", fileName);
            var dbPath = $"/images/{fileName}";

            try
            {
                // Save file
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    bookWithImage.Image.CopyTo(stream);
                }

                // Convert to BookDTO and inject the path
                var bookDto = new BookDTO
                {
                    Title = bookWithImage.Title,
                    Author = bookWithImage.Author,
                    Genre = bookWithImage.Genre,
                    Language = bookWithImage.Language,
                    Format = bookWithImage.Format,
                    Publisher = bookWithImage.Publisher,
                    PublicationDate = DateTime.SpecifyKind(bookWithImage.PublicationDate, DateTimeKind.Utc),
                    Price = bookWithImage.Price,
                    IsOnSale = bookWithImage.IsOnSale,
                    DiscountPercentage = bookWithImage.DiscountPercentage,
                    DiscountStartDate = bookWithImage.DiscountStartDate,
                    DiscountEndDate = bookWithImage.DiscountEndDate,
                    Description = bookWithImage.Description,
                    ISBN = bookWithImage.ISBN,
                    StockQuantity = bookWithImage.StockQuantity,
                    ImagePath = dbPath
                };

                var success = _adminService.AddBook(bookDto);
                return success ? Ok("Book added successfully with image.") : StatusCode(500, "Failed to add book.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Image upload failed: " + ex.Message);
            }
        }



        // PUT: api/Admin/edit-book-with-image/{bookId}
        [HttpPut("edit-book-with-image/{bookId}")]
        [Consumes("multipart/form-data")]
        public IActionResult EditBookWithImage(int bookId, [FromForm] EditBookWithImageDTO updated)
        {
            string? imagePath = null;

            if (updated.Image != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(updated.Image.FileName);
                var fullPath = Path.Combine("wwwroot", "images", fileName);
                imagePath = $"/images/{fileName}";

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    updated.Image.CopyTo(stream);
                }
            }

            var success = _adminService.EditBookWithImage(bookId, updated, imagePath);
            return success
                ? Ok(new { message = $"Book ID {bookId} updated successfully." })
                : NotFound(new { message = $"Book with ID {bookId} not found." });
        }




        // DELETE: api/Admin/delete-book

        [HttpDelete("delete-book/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var success = _adminService.DeleteBook(bookId);

            if (success)
                return Ok(new { message = $"Book ID {bookId} deleted successfully." });
            else
                return NotFound(new { message = $"Book with ID {bookId} not found." });
        }

        // PUT: api/Admin/set-discount
        [HttpPut("set-discount/{bookId}")]
        public IActionResult SetDiscount(int bookId, [FromBody] AdminSetDiscountDTO discount)
        {
            var success = _adminService.SetDiscount(bookId, discount);

            if (success)
                return Ok(new { message = "Discount applied successfully." });
            else
                return NotFound(new { message = $"Book with ID {bookId} not found." });
        }

        // POST: api/Admin/clear-expired-discounts
        [HttpPost("clear-expired-discounts")]
        public IActionResult ClearExpiredDiscounts()
        {
            var clearedCount = _adminService.ClearExpiredDiscounts();
            return Ok(new { message = $"{clearedCount} expired discounts cleared." });
        }
        // PUT: api/Admin/set-discount-combined
        [HttpPut("set-discount-combined/{bookId}")]
        public IActionResult SetDiscountWithAutoCleanup(int bookId, [FromBody] AdminSetDiscountDTO discount)
        {
            var success = _adminService.SetDiscountWithAutoCleanup(bookId, discount);

            if (success)
                return Ok(new { message = "Expired discounts cleared and new discount applied successfully." });
            else
                return NotFound(new { message = $"Book with ID {bookId} not found or discount invalid." });
        }


        // POST: api/Admin/create-announcement
        [HttpPost("announcement")]
        public IActionResult CreateAnnouncement([FromBody] AnnouncementDTO announcement)
        {
            var success = _adminService.CreateAnnouncement(announcement);

            if (!success)
                return BadRequest("Invalid announcement or failed to save.");

            return Ok(new { message = "Announcement published successfully." });
        }

        // GET: api/Admin/announcements
        [HttpGet("announcements")]
        public IActionResult GetAnnouncements()
        {
            var announcements = _adminService.GetAllAnnouncements();
            return Ok(announcements);
        }


        // POST: api/Admin/create-staff
        [HttpPost("create-staff")]
        public IActionResult CreateStaff([FromBody] StaffDTO staffDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Email validation
            if (string.IsNullOrEmpty(staffDto.Email) || !staffDto.Email.EndsWith("@gmail.com"))
                return BadRequest(new { message = "Email must be a valid @gmail.com address." });

            // Password validation
            if (string.IsNullOrEmpty(staffDto.Password) ||
                staffDto.Password.Length < 8 ||
                !staffDto.Password.Any(char.IsDigit) ||
                !staffDto.Password.Any(ch => !char.IsLetterOrDigit(ch)))
            {
                return BadRequest(new { message = "Password must be at least 8 characters long and include at least one number and one special character." });
            }

            // Check for duplicate
            var exists = _adminService.CheckStaffEmailExists(staffDto.Email);
            if (exists)
                return Conflict(new { message = "Staff with this email already exists." });

            var success = _adminService.CreateStaff(staffDto);

            if (success)
                return Ok(new { message = "Staff created successfully." });

            return StatusCode(500, new { message = "Unknown error creating staff." });
        }



    }
}
