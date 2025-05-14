using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;
using ReadNGo.DBContext;
using System.Collections.Generic;
using System.Linq;

namespace ReadNGo.Services.Implementations
{
    public class WishlistService : IWishlistService
    {
        private readonly ReadNGoContext _context;

        public WishlistService(ReadNGoContext context)
        {
            _context = context;
        }

        public bool AddToWishlist(WishlistDTO item)
        {
           
            var exists = _context.WishlistItems
                .Any(w => w.UserId == item.UserId && w.BookId == item.BookId);

            if (exists)
                return false;

            var wishlistItem = new WishlistItem
            {
                UserId = item.UserId,
                BookId = item.BookId
            };

            _context.WishlistItems.Add(wishlistItem);
            _context.SaveChanges();
            return true;
        }

        public List<WishlistDTO> GetWishlistByUser(int userId)
        {
            return _context.WishlistItems
                .Where(w => w.UserId == userId)
                .Select(w => new WishlistDTO
                {
                    UserId = w.UserId,
                    BookId = w.BookId
                }).ToList();
        }

        public bool RemoveFromWishlist(int userId, int bookId)
        {
            var item = _context.WishlistItems
                .FirstOrDefault(w => w.UserId == userId && w.BookId == bookId);

            if (item == null)
                return false;

            _context.WishlistItems.Remove(item);
            _context.SaveChanges();
            return true;
        }
    } 
} 