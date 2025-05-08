using System;
using System.Collections.Generic;


namespace ReadNGo_Group2_C20.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int StockQuantity { get; set; } = 0; // Default to 0 if not specified
        public string Description { get; set; }
        public string ISBN{ get; set; }
        public string Author { get; set; }
        public string Genre { get; set; }
        public string Language { get; set; }
        public string Format { get; set; }
        public string Publisher { get; set; }
        public DateTime PublicationDate { get; set; }
        public decimal Price { get; set; }
        public bool IsOnSale { get; set; } = false;
        public decimal? DiscountPercentage { get; set; }
        public DateTime? DiscountStartDate { get; set; }
        public DateTime? DiscountEndDate { get; set; }
        public string? ImagePath { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<Review> Reviews { get; set; }
        public ICollection<CartItem> CartItems { get; set; }
        public ICollection<WishlistItem> WishlistItems { get; set; }
    }
}
