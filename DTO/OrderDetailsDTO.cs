using System;
using System.Collections.Generic;

namespace ReadNGo.DTO
{
    public class OrderDetailsDTO
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string MembershipId { get; set; }
        public string ClaimCode { get; set; }
        public List<string> BookTitles { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountApplied { get; set; }
        public decimal FinalAmount { get; set; }
        public DateTime OrderDate { get; set; }
        public bool IsConfirmed { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public bool IsCancelled { get; set; }
    }
}