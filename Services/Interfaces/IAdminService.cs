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
       
        bool AddBook(BookDTO book);
        bool DeleteBook(int bookId);
        bool SetDiscount(int bookId, AdminSetDiscountDTO discountDto);
        bool CreateAnnouncement(AnnouncementDTO announcement);
        List<AnnouncementDTO> GetAllAnnouncements();

        int ClearExpiredDiscounts();
        bool CreateStaff(StaffDTO staffDto);

        bool CheckStaffEmailExists(string email);
        bool EditBookWithImage(int bookId, EditBookWithImageDTO updated, string? imagePath);
        bool SetDiscountWithAutoCleanup(int bookId, AdminSetDiscountDTO discountDto);



    }
}