using System;
using System.Collections.Generic;


namespace ReadNGo_Group2_C20.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public int BookId { get; set; }
        public Book Book { get; set; }

        public int Quantity { get; set; }
    }
}

