using ReadNGo.DTO;
using ReadNGo_Group2_C20.Models;
using ReadNGo.DBContext;
using ReadNGo.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ReadNGo_Group2_C20.DTO;


namespace ReadNGo.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly ReadNGoContext _context;

        public OrderService(ReadNGoContext context)
        {
            _context = context;
        }

        public bool CreateOrder(OrderCreateDTO orderDto)
        {
            try
            {
                // Step 1: Build order items
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

                // Step 2: Reject empty orders
                if (orderItems.Count == 0)
                {
                    Console.WriteLine("No valid books found for this order.");
                    return false;
                }

                // Step 3: Create order
                var order = new Order
                {
                    UserId = orderDto.UserId,
                    OrderItems = orderItems,
                    TotalAmount = orderItems.Sum(item => item.Price * item.Quantity),
                    OrderDate = DateTime.UtcNow,
                    IsCancelled = false,
                    ClaimCode = Guid.NewGuid().ToString().ToUpper(),
                    IsConfirmed = false
                };

                _context.Orders.Add(order);
                _context.SaveChanges();

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
                 .Include(o => o.OrderItems)
                 .ThenInclude(oi => oi.Book)
                 .Where(o => o.UserId == userId)
                .Select(o => new OrderDTO
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    TotalAmount = o.TotalAmount,
                    OrderDate = o.OrderDate,
                    IsCancelled = o.IsCancelled,
                    BookIds = o.OrderItems.Select(oi => oi.BookId).ToList(),
                    BookTitles = o.OrderItems.Select(oi => oi.Book.Title).ToList()
                })
                .ToList();

            return orders;
        }

        public ApplyDiscountResultDTO ApplyDiscount(ApplyDiscountDTO discount)
        {
            // Initialize result object to store the outcome of discount calculation
            var result = new ApplyDiscountResultDTO
            {
                Eligible = false,
                TotalDiscount = 0,
                AppliedRules = new List<string>(),
                FinalAmount = 0
            };

            try
            {
                // Step 1: Fetch the specific order based on OrderId and UserId
                // Also include related OrderItems to count number of books
                var order = _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefault(o => o.Id == discount.OrderId && o.UserId == discount.UserId);

                if (order == null)
                {
                    Console.WriteLine($"Order {discount.OrderId} for user {discount.UserId} not found.");
                    return result;
                }

                // Rule 1: Bulk Discount → if the order has 5 or more books
                if (order.OrderItems.Count >= 5)
                {
                    result.TotalDiscount += 5;
                    result.Eligible = true;
                    result.AppliedRules.Add("bulk_order_5+");
                }

                // Rule 2: Loyalty Discount → if user has placed 10 completed orders before this one
                int completedOrders = _context.Orders
                    .Count(o => o.UserId == discount.UserId && !o.IsCancelled && o.Id != discount.OrderId);

                if (completedOrders > 0 && completedOrders % 10 == 0)
                {
                    result.TotalDiscount += 10;
                    result.Eligible = true;
                    result.AppliedRules.Add("loyalty_10_orders");
                }

                // Final Price = Original price - stacked discount
                result.FinalAmount = Math.Round(order.TotalAmount * (1 - (result.TotalDiscount / 100m)), 2);

                // Log result to server console (for dev purposes)
                Console.WriteLine($"User {discount.UserId} eligible for {result.TotalDiscount}% discount. Final price: {result.FinalAmount}");
            }
            catch (Exception ex)
            {
                // Catch and log any errors during discount calculation
                Console.WriteLine("APPLY DISCOUNT ERROR: " + ex.Message);
            }

            // Return the final discount result
            return result;
        }




        public DiscountResultDTO CheckDiscount(int userId)
        {
            try
            {
                decimal discount = 0;
                bool eligible = false;

                // RULE 1: If any order contains 5 or more books → +5%
                var hasLargeOrder = _context.Orders
                    .Include(o => o.OrderItems)
                    .Any(o => o.UserId == userId && !o.IsCancelled &&
                              o.OrderItems.Count >= 5);

                if (hasLargeOrder)
                {
                    discount += 5;
                    eligible = true;
                }

                // RULE 2: 10 successful orders → +10%
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
