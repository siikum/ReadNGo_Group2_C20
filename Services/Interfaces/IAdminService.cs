using ReadNGo.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Interfaces
{
    public interface IAdminService
    {
        bool AddBook(BookDTO book);
        bool EditBook(int bookId, BookDTO updated);
        bool DeleteBook(int bookId);
        bool SetDiscount(int bookId, DiscountDTO discount);
        bool CreateAnnouncement(AnnouncementDTO announcement);
    }
}