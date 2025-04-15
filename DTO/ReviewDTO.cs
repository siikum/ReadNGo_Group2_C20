using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.DTO
{
    public class ReviewDTO
    {
        public int UserId { get; set; }
        public int BookId { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; } // 1 to 5
    }

}