using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffController : ControllerBase
    {
        private readonly IStaffService _staffService;

        public StaffController(IStaffService staffService)
        {
            _staffService = staffService;
        }

        // POST: api/staff/process-claim
        [HttpPost("process-claim")]
        public async Task<IActionResult> ProcessClaim([FromBody] ProcessClaimDTO claimData)
        {
            if (claimData == null || string.IsNullOrEmpty(claimData.ClaimCode) || string.IsNullOrEmpty(claimData.MembershipId))
            {
                return BadRequest("Claim code and membership ID are required.");
            }

            var result = await _staffService.ProcessClaim(claimData);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        // GET: api/staff/verify-claim/{claimCode}
        [HttpGet("verify-claim/{claimCode}")]
        public async Task<IActionResult> VerifyClaimCode(string claimCode)
        {
            if (string.IsNullOrEmpty(claimCode))
            {
                return BadRequest("Claim code is required.");
            }

            var orderDetails = await _staffService.VerifyClaimCode(claimCode);

            if (orderDetails == null)
            {
                return NotFound("Order not found with the provided claim code.");
            }

            return Ok(orderDetails);
        }

        [HttpGet("order/{orderId}/logs")]
        public async Task<IActionResult> GetOrderLogs(int orderId)
        {
            var logs = await _staffService.GetOrderLogs(orderId);
            return Ok(logs);
        }

        // GET: api/staff/orders/pending
        [HttpGet("orders/pending")]
        public async Task<IActionResult> GetPendingOrders()
        {
            var orders = await _staffService.GetPendingOrders();
            return Ok(orders);
        }

        // GET: api/staff/orders/processed
        [HttpGet("orders/processed")]
        public async Task<IActionResult> GetProcessedOrders()
        {
            var orders = await _staffService.GetProcessedOrders();
            return Ok(orders);
        }

        // GET: api/staff/order/{orderId}
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            var orderDetails = await _staffService.GetOrderDetails(orderId);

            if (orderDetails == null)
            {
                return NotFound($"Order with ID {orderId} not found.");
            }

            return Ok(orderDetails);
        }

        // GET: api/staff/orders/date-range
        [HttpGet("orders/date-range")]
        public async Task<IActionResult> GetOrdersByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            if (startDate > endDate)
            {
                return BadRequest("Start date must be before end date.");
            }

            var orders = await _staffService.GetOrdersByDateRange(startDate, endDate);
            return Ok(orders);
        }

        // GET: api/staff/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var pendingOrders = await _staffService.GetPendingOrders();
            var processedOrders = await _staffService.GetProcessedOrders();

            var dashboardData = new
            {
                PendingOrdersCount = pendingOrders.Count,
                ProcessedOrdersCount = processedOrders.Count,
                TotalOrders = pendingOrders.Count + processedOrders.Count,
                PendingOrdersValue = pendingOrders.Sum(o => o.FinalAmount),
                ProcessedOrdersValue = processedOrders.Sum(o => o.FinalAmount)
            };

            return Ok(dashboardData);
        }
    }
}