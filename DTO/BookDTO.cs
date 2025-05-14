using System;

namespace ReadNGo.DTO
{
    public class BookDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Genre { get; set; }
        public string Language { get; set; }
        public string Format { get; set; }
        public string Publisher { get; set; }
        public DateTime PublicationDate { get; set; }

        public string Category { get; set; }  
        public DateTime ArrivalDate { get; set; }
        public decimal Price { get; set; }
        public bool IsOnSale { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DateTime? DiscountStartDate { get; set; }
        public DateTime? DiscountEndDate { get; set; }

        
        public decimal ActualPrice => IsOnSale && DiscountPercentage.HasValue
            ? Price * (1 - DiscountPercentage.Value / 100)
            : Price;

        public string Description { get; set; }
        public string ISBN { get; set; }
        public int StockQuantity { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public string? ImagePath { get; set; }

    }
}