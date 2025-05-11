namespace ReadNGo.DTO
{
    public class ProcessClaimResultDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public OrderDetailsDTO OrderDetails { get; set; }
    }
}