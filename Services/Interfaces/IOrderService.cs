using ReadNGo.DTO;
using ReadNGo_Group2_C20.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace ReadNGo.Services.Interfaces
{
    public interface IOrderService
    {
        bool CreateOrder(OrderCreateDTO order);
        bool CancelOrder(int orderId);
        List<OrderDTO> GetOrdersByUser(int userId);
        ApplyDiscountResultDTO ApplyDiscount(ApplyDiscountDTO discount);
        DiscountResultDTO CheckDiscount(int userId);
    }
}