using ReadNGo.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace ReadNGo.Services.Interfaces
{
    public interface IReviewService
    {
        bool AddReview(ReviewDTO review);
        List<object> GetReviewsForBook(int bookId); 
    }

}