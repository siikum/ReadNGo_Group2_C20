using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Implementations
{
    public class OrderService : IOrderService
    {
        public bool CreateOrder(OrderDTO order) => true;

        public bool CancelOrder(int orderId) => true;

        public List<OrderDTO> GetOrdersByUser(int userId) => new();

        public bool ApplyDiscount(DiscountDTO discount) => true;

        public bool CheckDiscount(int userId) => true;
    }
}