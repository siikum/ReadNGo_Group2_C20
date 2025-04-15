using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.DTO
{
    public class CartItemDTO
    {
        public int UserId { get; set; }
        public int BookId { get; set; }
        public int Quantity { get; set; }
    }

}