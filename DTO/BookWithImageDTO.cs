using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace ReadNGo.DTO
{
    public class BookWithImageDTO
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public string Genre { get; set; }
        public string Language { get; set; }
        public string Format { get; set; }
        public string Publisher { get; set; }
        public DateTime PublicationDate { get; set; }
        public string Category { get; set; }  // Added Category
        public DateTime ArrivalDate { get; set; }  // Added ArrivalDate
        public decimal Price { get; set; }
        public bool IsOnSale { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DateTime? DiscountStartDate { get; set; }
        public DateTime? DiscountEndDate { get; set; }
        public string Description { get; set; }
        public string ISBN { get; set; }
        public int StockQuantity { get; set; }

        [Required]
        public IFormFile Image { get; set; } // file upload
    }
}