using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ReadNGo_Group2_C20.DTO
{
    public class ApplyDiscountDTO
    {
        public int UserId { get; set; }
        public int OrderId { get; set; }
    }
}
