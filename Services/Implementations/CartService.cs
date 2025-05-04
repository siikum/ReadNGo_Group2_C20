using Microsoft.EntityFrameworkCore;
using ReadNGo.DBContext;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;
using System.Collections.Generic;
using System.Linq;

namespace ReadNGo.Services.Implementations
{
    public class CartService : ICartService
    {
        private readonly ReadNGoContext _context;

        public CartService(ReadNGoContext context)
        {
            _context = context;
        }

        public bool AddToCart(CartItemDTO item)
        {
            if (item.Quantity <= 0)
                return false;

            var existing = _context.CartItems
                .FirstOrDefault(c => c.UserId == item.UserId && c.BookId == item.BookId);

            if (existing != null)
            {
                existing.Quantity += item.Quantity;
                _context.CartItems.Update(existing);
            }
            else
            {
                var newItem = new CartItem
                {
                    UserId = item.UserId,
                    BookId = item.BookId,
                    Quantity = item.Quantity
                };
                _context.CartItems.Add(newItem);
            }

            _context.SaveChanges();
            return true;
        }

        public List<CartItem> GetCartItems(int userId)
        {
            return _context.CartItems
                .Where(c => c.UserId == userId)
                .Include(c => c.Book)
                .ToList();
        }

        public bool RemoveFromCart(int userId, int bookId)
        {
            var item = _context.CartItems.FirstOrDefault(c => c.UserId == userId && c.BookId == bookId);
            if (item == null) return false;

            _context.CartItems.Remove(item);
            _context.SaveChanges();
            return true;
        }
    }
}
