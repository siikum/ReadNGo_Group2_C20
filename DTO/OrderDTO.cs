using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.DTO
{
    public class OrderDTO
    {
        public int UserId { get; set; }
        public List<int> BookIds { get; set; }
        public string PaymentMethod { get; set; }
        public decimal TotalAmount { get; set; }
    }

}