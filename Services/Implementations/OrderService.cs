using ReadNGo.DTO;
using ReadNGo_Group2_C20.Models;
using ReadNGo.DBContext;
using ReadNGo.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ReadNGo_Group2_C20.DTO;
using ReadNGo_Group2_C20.Services.Interfaces;
using ReadNGo_Group2_C20.Services.Implementations;
using Microsoft.AspNetCore.SignalR;
using ReadNGo_Group2_C20.Hubs;


namespace ReadNGo.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly ReadNGoContext _context;
        private readonly IEmailService _emailService;
        private readonly IHubContext<OrderNotificationHub> _hub;



        public OrderService(ReadNGoContext context, IEmailService emailService, IHubContext<OrderNotificationHub> hub)
        {
            _context = context;
            _emailService = emailService;
            _hub = hub;
        }



        public async Task<bool> CreateOrder(OrderCreateDTO orderDto)
        {
            try
            {
              
                var orderItems = new List<OrderItem>();
                foreach (var bookId in orderDto.BookIds)
                {
                    var book = _context.Books.FirstOrDefault(b => b.Id == bookId);
                    if (book != null)
                    {
                        orderItems.Add(new OrderItem
                        {
                            BookId = book.Id,
                            Quantity = 1,
                            Price = book.Price
                        });
                    }
                }

               
                if (orderItems.Count == 0)
                {
                    Console.WriteLine("No valid books found for this order.");
                    return false;
                }

              
                var discountCheck = CalculateOrderDiscount(orderDto.UserId, orderItems.Count);

                //  Create order
                var baseTotal = orderItems.Sum(item => item.Price * item.Quantity);
                var finalTotal = Math.Round(baseTotal * (1 - discountCheck.Discount / 100m), 2);

                var order = new Order
                {
                    UserId = orderDto.UserId,
                    OrderItems = orderItems,
                    TotalAmount = finalTotal, 
                    OrderDate = DateTime.UtcNow,
                    IsCancelled = false,
                    ClaimCode = Guid.NewGuid().ToString().ToUpper(),
                    IsConfirmed = false
                };

                _context.Orders.Add(order);
                _context.SaveChanges();

              
                var user = _context.Users.FirstOrDefault(u => u.Id == orderDto.UserId);
                if (user != null)
                {
                    _emailService.SendOrderConfirmation(
                        toEmail: user.Email,
                        userName: user.FullName,
                        userId: user.Id,
                        membershipId: user.MembershipId.ToString(),
                        bookTitles: orderItems.Select(i => _context.Books.FirstOrDefault(b => b.Id == i.BookId)?.Title ?? "Unknown").ToList(),
                        claimCode: order.ClaimCode,
                        totalBeforeDiscount: order.TotalAmount,
                        discountPercent: discountCheck.Discount,
                        totalAfterDiscount: Math.Round(order.TotalAmount * (1 - discountCheck.Discount / 100m), 2)
                    );

                    await _hub.Clients.All.SendAsync("ReceiveOrder", new
                    {
                        User = user.FullName,
                        ClaimCode = order.ClaimCode,
                        BookCount = orderItems.Count,
                        Total = order.TotalAmount,
                        Discount = discountCheck.Discount,
                        FinalAmount = Math.Round(order.TotalAmount * (1 - discountCheck.Discount / 100m), 2),
                        Timestamp = DateTime.UtcNow
                    })
                    .ContinueWith(task =>
                    {
                        if (task.IsFaulted)
                        {
                            Console.WriteLine("❌ SignalR failed: " + task.Exception?.GetBaseException().Message);
                        }
                        else
                        {
                            Console.WriteLine("✅ SignalR message sent successfully");
                        }
                    });
                }

                Console.WriteLine($"Order placed for user {orderDto.UserId} with {order.OrderItems.Count} items. ClaimCode: {order.ClaimCode}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("CREATE ORDER ERROR: " + ex.Message);
                return false;
            }
        }
        public bool CancelOrder(int orderId)
        {
            try
            {
                var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);
                if (order == null)
                {
                    Console.WriteLine($"Cancel failed: Order with ID {orderId} not found.");
                    return false;
                }

                if (order.IsCancelled)
                {
                    Console.WriteLine($"Order {orderId} is already cancelled.");
                    return false;
                }

                order.IsCancelled = true;
                _context.SaveChanges();

                Console.WriteLine($"Order {orderId} successfully cancelled.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("CANCEL ORDER ERROR: " + ex.Message);
                return false;
            }
        }
        public List<OrderDTO> GetOrdersByUser(int userId)
        {
            var orders = _context.Orders
                .AsSplitQuery()
                .Include(order => order.OrderItems)    
                .ThenInclude(oi => oi.Book)
                .Where(order => order.UserId == userId) 
                .Select(order => new OrderDTO           
                {
                    Id = order.Id,
                    UserId = order.UserId,
                    TotalAmount = order.TotalAmount,
                    OrderDate = order.OrderDate,
                    IsCancelled = order.IsCancelled,
                    IsProcessed = order.IsConfirmed,   
                    BookIds = order.OrderItems.Select(oi => oi.BookId).ToList(),
                    BookTitles = order.OrderItems.Select(oi => oi.Book.Title).ToList()
                })
                .ToList();

            return orders;
        }

        public ApplyDiscountResultDTO ApplyDiscount(ApplyDiscountDTO discount)
        {
            
            var result = new ApplyDiscountResultDTO
            {
                Eligible = false,
                TotalDiscount = 0,
                AppliedRules = new List<string>(),
                FinalAmount = 0
            };

            try
            {
                
                var order = _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefault(o => o.Id == discount.OrderId && o.UserId == discount.UserId);

                if (order == null)
                {
                    Console.WriteLine($"Order {discount.OrderId} for user {discount.UserId} not found.");
                    return result;
                }

                
                if (order.OrderItems.Count >= 5)
                {
                    result.TotalDiscount += 5;
                    result.Eligible = true;
                    result.AppliedRules.Add("bulk_order_5+");
                }

                
                int completedOrders = _context.Orders
                    .Count(o => o.UserId == discount.UserId && !o.IsCancelled && o.Id != discount.OrderId);

                if (completedOrders > 0 && completedOrders % 10 == 0)
                {
                    result.TotalDiscount += 10;
                    result.Eligible = true;
                    result.AppliedRules.Add("loyalty_10_orders");
                }

             
                result.FinalAmount = Math.Round(order.TotalAmount * (1 - (result.TotalDiscount / 100m)), 2);

                
                Console.WriteLine($"User {discount.UserId} eligible for {result.TotalDiscount}% discount. Final price: {result.FinalAmount}");
            }
            catch (Exception ex)
            {
               
                Console.WriteLine("APPLY DISCOUNT ERROR: " + ex.Message);
            }

           
            return result;
        }


        public DiscountResultDTO CalculateOrderDiscount(int userId, int bookCount)
        {
            try
            {
                decimal discount = 0;
                bool eligible = false;

                
                if (bookCount >= 5)
                {
                    discount += 5;
                    eligible = true;
                }

              
                int completedOrderCount = _context.Orders
                    .Count(o => o.UserId == userId && !o.IsCancelled);

               
                if ((completedOrderCount + 1) % 10 == 0)
                {
                    discount += 10;
                    eligible = true;
                }

                return new DiscountResultDTO
                {
                    Eligible = eligible,
                    Discount = discount
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine("CALCULATE ORDER DISCOUNT ERROR: " + ex.Message);
                return new DiscountResultDTO
                {
                    Eligible = false,
                    Discount = 0
                };
            }
        }

        public DiscountResultDTO CheckDiscount(int userId)
        {
            try
            {
                decimal discount = 0;
                bool eligible = false;

              
                var hasLargeOrder = _context.Orders
                    .Include(o => o.OrderItems)
                    .Any(o => o.UserId == userId && !o.IsCancelled &&
                              o.OrderItems.Count >= 5);

                if (hasLargeOrder)
                {
                    discount += 5;
                    eligible = true;
                }

            
                int completedOrderCount = _context.Orders
                    .Count(o => o.UserId == userId && !o.IsCancelled);

                if (completedOrderCount > 0 && completedOrderCount % 10 == 0)
                {
                    discount += 10;
                    eligible = true;
                }

                return new DiscountResultDTO
                {
                    Eligible = eligible,
                    Discount = discount
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine("CHECK DISCOUNT ERROR: " + ex.Message);
                return new DiscountResultDTO
                {
                    Eligible = false,
                    Discount = 0
                };
            }
        }


    }
}
