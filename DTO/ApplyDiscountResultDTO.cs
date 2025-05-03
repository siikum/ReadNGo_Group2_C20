using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ReadNGo_Group2_C20.DTO
{
    public class ApplyDiscountResultDTO
    {
        public bool Eligible { get; set; }
        public decimal TotalDiscount { get; set; }
        public List<string> AppliedRules { get; set; }
        public decimal FinalAmount { get; set; } // ✅ newly added
    }

}
