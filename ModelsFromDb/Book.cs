using System;
using System.Collections.Generic;

namespace ReadNGo_Group2_C20.ModelsFromDb;

public partial class Book
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Author { get; set; } = null!;

    public string Genre { get; set; } = null!;

    public string Language { get; set; } = null!;

    public string Format { get; set; } = null!;

    public string Publisher { get; set; } = null!;

    public DateTime PublicationDate { get; set; }

    public decimal Price { get; set; }

    public bool IsOnSale { get; set; }

    public decimal? DiscountPercentage { get; set; }

    public DateTime? DiscountStartDate { get; set; }

    public DateTime? DiscountEndDate { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
}
