using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.DTO
{
    public class DiscountDTO
    {
        public int UserId { get; set; }
        public List<int> BookIds { get; set; }
        public int CurrentOrderCount { get; set; }
        public decimal Percentage { get; set; }


    }


}