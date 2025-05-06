using System.Collections.Generic;
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
        [HttpPost("add-book")]
        public IActionResult AddBook([FromBody] BookDTO book)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = _adminService.AddBook(book);

            if (success)
                return Ok(new { message = "Book added successfully." });
            else
                return StatusCode(500, "Failed to add book.");
        }

        // PATCH: api/Admin/edit-book

        [HttpPut("edit-book/{bookId}")]
        public IActionResult EditBook(int bookId, [FromBody] BookDTO updated)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = _adminService.EditBook(bookId, updated);

            if (success)
                return Ok(new { message = $"Book ID {bookId} updated successfully." });
            else
                return NotFound(new { message = $"Book with ID {bookId} not found." });
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


        // POST: api/Admin/create-announcement
        [HttpPost("announcement")]
        public IActionResult CreateAnnouncement([FromBody] AnnouncementDTO announcement)
        {
            var success = _adminService.CreateAnnouncement(announcement);

            if (!success)
                return BadRequest("Invalid announcement or failed to save.");

            return Ok(new { message = "Announcement published successfully." });
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
