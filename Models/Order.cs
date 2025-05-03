using System;
using System.Collections.Generic;

namespace ReadNGo_Group2_C20.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public List<OrderItem> OrderItems { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public bool IsCancelled { get; set; } = false;
    }

    public class OrderItem
    {
        public int Id { get; set; }

        public int BookId { get; set; }
        public Book Book { get; set; }

        public int OrderId { get; set; }      // ✅ Add this line (foreign key)
        public Order Order { get; set; }      // ✅ Add this line (navigation)

        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }


}
