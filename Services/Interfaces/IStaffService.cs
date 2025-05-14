using ReadNGo.DTO;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReadNGo.Services.Interfaces
{
    public interface IStaffService
    {
        
        Task<ProcessClaimResultDTO> ProcessClaim(ProcessClaimDTO claimData);

        
        Task<OrderDetailsDTO> VerifyClaimCode(string claimCode);

        
        Task<List<StaffOrderSummaryDTO>> GetPendingOrders();

      
        Task<List<StaffOrderSummaryDTO>> GetProcessedOrders();

       
        Task<OrderDetailsDTO> GetOrderDetails(int orderId);

      
        Task<List<StaffOrderSummaryDTO>> GetOrdersByDateRange(DateTime startDate, DateTime endDate);
        Task<List<OrderProcessingLogDTO>> GetOrderLogs(int orderId);
    }
}