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

        // NEW FIELDS
        public string ClaimCode { get; set; }  // UUID string
        public bool IsConfirmed { get; set; } = false;
        public DateTime? ConfirmedAt { get; set; }
    }


    public class OrderItem
    {
        public int Id { get; set; }

        public int BookId { get; set; }
        public Book Book { get; set; }

        public int OrderId { get; set; }      
        public Order Order { get; set; }      

        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }


}
