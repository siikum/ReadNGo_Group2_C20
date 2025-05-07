using ReadNGo.DTO;
using ReadNGo_Group2_C20.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Interfaces
{
    public interface IAdminService
    {
        Task<bool> AddBook(AddBookDto book);
        bool EditBook(int bookId, BookDTO updated);
        bool DeleteBook(int bookId);
        bool SetDiscount(int bookId, AdminSetDiscountDTO discountDto);
        bool CreateAnnouncement(AnnouncementDTO announcement);
        int ClearExpiredDiscounts();
        bool CreateStaff(StaffDTO staffDto);

        bool CheckStaffEmailExists(string email);


    }
}