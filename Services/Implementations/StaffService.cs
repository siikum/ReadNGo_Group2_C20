using ReadNGo.DBContext;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReadNGo.Services.Implementations
{
    public class StaffService : IStaffService
    {
        private readonly ReadNGoContext _context;

        public StaffService(ReadNGoContext context)
        {
            _context = context;
        }

        public async Task<List<OrderProcessingLogDTO>> GetOrderLogs(int orderId)
        {
            return await _context.OrderProcessingLogs
                .Where(l => l.OrderId == orderId)
                .OrderByDescending(l => l.Timestamp)
                .Select(l => new OrderProcessingLogDTO
                {
                    Id = l.Id,
                    OrderId = l.OrderId,
                    Action = l.Action,
                    Success = l.Success,
                    ResultMessage = l.ResultMessage,
                    ClaimCodeUsed = l.ClaimCodeUsed,
                    MembershipIdProvided = l.MembershipIdProvided,
                    Timestamp = l.Timestamp
                })
                .ToListAsync();
        }
        public async Task<ProcessClaimResultDTO> ProcessClaim(ProcessClaimDTO claimData)
        {
            var result = new ProcessClaimResultDTO();
            var log = new OrderProcessingLog
            {
                Action = "ProcessClaim",
                ClaimCodeUsed = claimData.ClaimCode,
                MembershipIdProvided = claimData.MembershipId,
                Timestamp = DateTime.UtcNow
            };

            try
            {
                var order = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                    .FirstOrDefaultAsync(o => o.ClaimCode == claimData.ClaimCode);

                if (order == null)
                {
                    log.Success = false;
                    log.ResultMessage = "Invalid claim code. Order not found.";
                    _context.OrderProcessingLogs.Add(log);
                    await _context.SaveChangesAsync();

                    return new ProcessClaimResultDTO
                    {
                        Success = false,
                        Message = log.ResultMessage
                    };
                }

                log.OrderId = order.Id;

                // Existing validation checks...
                if (order.IsConfirmed)
                {
                    log.Success = false;
                    log.ResultMessage = "Order already processed.";
                }
                else if (order.IsCancelled)
                {
                    log.Success = false;
                    log.ResultMessage = "Order is cancelled.";
                }
                else if (order.User.MembershipId.ToString() != claimData.MembershipId)
                {
                    log.Success = false;
                    log.ResultMessage = "Membership ID mismatch.";
                }
                else
                {
                    // Process the order
                    order.IsConfirmed = true;
                    order.ConfirmedAt = DateTime.UtcNow;
                    log.Success = true;
                    log.ResultMessage = "Order successfully processed!";
                }

                _context.OrderProcessingLogs.Add(log);
                await _context.SaveChangesAsync();

                // Return result with order details...
                return new ProcessClaimResultDTO
                {
                    Success = log.Success,
                    Message = log.ResultMessage,
                    OrderDetails = log.Success ? await GetOrderDetails(order.Id) : null
                };
            }
            catch (Exception ex)
            {
                log.Success = false;
                log.ResultMessage = $"Error: {ex.Message}";
                _context.OrderProcessingLogs.Add(log);
                await _context.SaveChangesAsync();

                return new ProcessClaimResultDTO
                {
                    Success = false,
                    Message = log.ResultMessage
                };
            }
        }

        public async Task<List<StaffOrderSummaryDTO>> GetPendingOrders()
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .Where(o => !o.IsConfirmed && !o.IsCancelled)
                .Select(o => new StaffOrderSummaryDTO
                {
                    OrderId = o.Id,
                    UserName = o.User.FullName,
                    ClaimCode = o.ClaimCode,
                    BookCount = o.OrderItems.Count,
                    FinalAmount = o.TotalAmount, // You might want to calculate discount here
                    OrderDate = o.OrderDate,
                    IsConfirmed = o.IsConfirmed,
                    IsCancelled = o.IsCancelled
                })
                .ToListAsync();
        }

        public async Task<List<StaffOrderSummaryDTO>> GetProcessedOrders()
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .Where(o => o.IsConfirmed)
                .Select(o => new StaffOrderSummaryDTO
                {
                    OrderId = o.Id,
                    UserName = o.User.FullName,
                    ClaimCode = o.ClaimCode,
                    BookCount = o.OrderItems.Count,
                    FinalAmount = o.TotalAmount,
                    OrderDate = o.OrderDate,
                    IsConfirmed = o.IsConfirmed,
                    IsCancelled = o.IsCancelled
                })
                .ToListAsync();
        }

        public async Task<OrderDetailsDTO> GetOrderDetails(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
                return null;

            var orderService = new OrderService(_context, null, null);
            var discountResult = orderService.CheckDiscount(order.UserId);
            var finalAmount = order.TotalAmount * (1 - discountResult.Discount / 100m);

            return new OrderDetailsDTO
            {
                OrderId = order.Id,
                UserId = order.UserId,
                UserName = order.User.FullName,
                UserEmail = order.User.Email,
                MembershipId = order.User.MembershipId.ToString(),
                ClaimCode = order.ClaimCode,
                BookTitles = order.OrderItems.Select(oi => oi.Book.Title).ToList(),
                TotalAmount = order.TotalAmount,
                DiscountApplied = discountResult.Discount,
                FinalAmount = Math.Round(finalAmount, 2),
                OrderDate = order.OrderDate,
                IsConfirmed = order.IsConfirmed,
                ConfirmedAt = order.ConfirmedAt,
                IsCancelled = order.IsCancelled
            };
        }

        public async Task<List<StaffOrderSummaryDTO>> GetOrdersByDateRange(DateTime startDate, DateTime endDate)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
                .Select(o => new StaffOrderSummaryDTO
                {
                    OrderId = o.Id,
                    UserName = o.User.FullName,
                    ClaimCode = o.ClaimCode,
                    BookCount = o.OrderItems.Count,
                    FinalAmount = o.TotalAmount,
                    OrderDate = o.OrderDate,
                    IsConfirmed = o.IsConfirmed,
                    IsCancelled = o.IsCancelled
                })
                .ToListAsync();
        }
        public async Task<OrderDetailsDTO> VerifyClaimCode(string claimCode)
        {
            var log = new OrderProcessingLog
            {
                Action = "VerifyClaimCode",
                ClaimCodeUsed = claimCode,
                Timestamp = DateTime.UtcNow
            };

            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .FirstOrDefaultAsync(o => o.ClaimCode == claimCode);

            if (order == null)
            {
                log.Success = false;
                log.ResultMessage = "Order not found";
            }
            else
            {
                log.OrderId = order.Id;
                log.Success = true;
                log.ResultMessage = "Claim code verified";
            }

            _context.OrderProcessingLogs.Add(log);
            await _context.SaveChangesAsync();

            return order != null ? await GetOrderDetails(order.Id) : null;
        }

    }
}