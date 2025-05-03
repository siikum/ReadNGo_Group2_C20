using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo_Group2_C20.DTO
{
    public class AdminSetDiscountDTO
    {
        public decimal Percentage { get; set; }
        public bool IsOnSale { get; set; }
        public DateTime? StartDate { get; set; }  // optional
        public DateTime? EndDate { get; set; }    // optional
    } 
}
