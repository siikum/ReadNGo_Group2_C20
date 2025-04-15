using System;
using System.Collections.Generic;


namespace ReadNGo_Group2_C20.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Genre { get; set; }
        public string Language { get; set; }
        public string Format { get; set; }
        public string Publisher { get; set; }
        public DateTime PublicationDate { get; set; }
        public decimal Price { get; set; }
        public bool IsOnSale { get; set; } = false;
        public decimal? DiscountPercentage { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<CartItem> CartItems { get; set; }
        public ICollection<WishlistItem> WishlistItems { get; set; }
    }
}
