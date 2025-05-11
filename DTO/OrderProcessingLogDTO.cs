namespace ReadNGo.DTO
{
    public class OrderProcessingLogDTO
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string Action { get; set; }
        public bool Success { get; set; }
        public string ResultMessage { get; set; }
        public string ClaimCodeUsed { get; set; }
        public string MembershipIdProvided { get; set; }
        public DateTime Timestamp { get; set; }
    }
}