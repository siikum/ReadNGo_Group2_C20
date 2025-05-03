using ReadNGo.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace ReadNGo.Services.Interfaces
{
    public interface ICartService
    {
        bool AddToCart(CartItemDTO item);
        List<CartItemDTO> GetCartByUser(int userId);
        bool RemoveFromCart(int bookId);
    }
}