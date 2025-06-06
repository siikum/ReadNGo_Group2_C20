﻿
namespace ReadNGo_Group2_C20.DTO
{
    public class AddBookDto
    {
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
        public string Description { get; set; }
        public string ISBN { get; set; }
        public int StockQuantity { get; set; }
        public string? ImagePath { get; set; }
        public IFormFile? Image { get; set; }
    }
}

