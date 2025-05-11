using ReadNGo.DTO;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReadNGo.Services.Interfaces
{
    public interface IStaffService
    {
        // Process a claim code and mark order as confirmed
        Task<ProcessClaimResultDTO> ProcessClaim(ProcessClaimDTO claimData);

        // Verify claim code without processing (just check if valid)
        Task<OrderDetailsDTO> VerifyClaimCode(string claimCode);

        // Get all pending (unconfirmed) orders
        Task<List<StaffOrderSummaryDTO>> GetPendingOrders();

        // Get all processed (confirmed) orders
        Task<List<StaffOrderSummaryDTO>> GetProcessedOrders();

        // Get order details by ID
        Task<OrderDetailsDTO> GetOrderDetails(int orderId);

        // Get orders by date range (optional)
        Task<List<StaffOrderSummaryDTO>> GetOrdersByDateRange(DateTime startDate, DateTime endDate);
        Task<List<OrderProcessingLogDTO>> GetOrderLogs(int orderId);
    }
}