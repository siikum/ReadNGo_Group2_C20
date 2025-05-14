using Microsoft.EntityFrameworkCore;
using ReadNGo.DBContext;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ReadNGo.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly ReadNGoContext _context;

        public ReviewService(ReadNGoContext context)
        {
            _context = context;
        }

        public bool AddReview(ReviewDTO reviewDto)
        {
            
            var hasPurchased = _context.OrderItems
                .Include(oi => oi.Order)
                .Any(oi => oi.BookId == reviewDto.BookId &&
                           oi.Order.UserId == reviewDto.UserId &&
                           !oi.Order.IsCancelled);

            if (!hasPurchased)
                return false;

            var review = new Review
            {
                UserId = reviewDto.UserId,
                BookId = reviewDto.BookId,
                Comment = reviewDto.Comment,
                Rating = reviewDto.Rating,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            _context.SaveChanges();
            return true;
        }

        public List<object> GetReviewsForBook(int bookId)
        {
            return _context.Reviews
                .Where(r => r.BookId == bookId)
                .Include(r => r.User)
                .Select(r => new
                {
                    r.Id,
                    r.Comment,
                    r.Rating,
                    r.CreatedAt,
                    UserName = r.User.FullName
                })
                .ToList<object>();
        }

    }
}
