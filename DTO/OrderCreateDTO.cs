using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ReadNGo_Group2_C20.DTO
{
    public class OrderCreateDTO
    {
        public int UserId { get; set; }
        public List<int> BookIds { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
