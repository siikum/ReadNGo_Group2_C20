using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ReadNGo_Group2_C20.DTO
{
    public class DiscountResultDTO
    {
        public bool Eligible { get; set; }
        public decimal Discount { get; set; }
    }
}
