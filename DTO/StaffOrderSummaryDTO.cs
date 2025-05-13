using System;

namespace ReadNGo.DTO
{
    public class StaffOrderSummaryDTO
    {
        public int OrderId { get; set; }
        public string UserName { get; set; }
        public string ClaimCode { get; set; }
        public int BookCount { get; set; }
        public decimal FinalAmount { get; set; }
        public DateTime OrderDate { get; set; }
        public bool IsConfirmed { get; set; }
        public bool IsCancelled { get; set; }
    }
}