using System;

namespace ReadNGo_Group2_C20.Models
{
    public class OrderProcessingLog
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public string Action { get; set; } // "Verified", "Processed", "ProcessFailed"
        public bool Success { get; set; }
        public string ResultMessage { get; set; }
        public string ClaimCodeUsed { get; set; }
        public string? MembershipIdProvided { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}