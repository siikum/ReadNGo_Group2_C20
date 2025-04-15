using ReadNGo.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace ReadNGo.Services.Interfaces
{
    public interface IOrderService
    {
        bool CreateOrder(OrderDTO order);
        bool CancelOrder(int orderId);
        List<OrderDTO> GetOrdersByUser(int userId);
        bool ApplyDiscount(DiscountDTO discount);
        bool CheckDiscount(int userId);
    }
}