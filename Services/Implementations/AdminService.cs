using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Implementations
{
    public class AdminService : IAdminService
    {
        public bool AddBook(BookDTO book) => true;

        public bool EditBook(int bookId, BookDTO updated) => true;

        public bool DeleteBook(int bookId) => true;

        public bool SetDiscount(int bookId, DiscountDTO discount) => true;

        public bool CreateAnnouncement(AnnouncementDTO announcement) => true;
    }
}