using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        public bool AddReview(ReviewDTO review) => true;

        public List<ReviewDTO> GetReviewsForBook(int bookId) => new();
    }
}