using System.Collections.Generic;
using ReadNGo.DTO;
using ReadNGo_Group2_C20.Models;

namespace ReadNGo.Services.Interfaces
{
    public interface ICartService
    {
        bool AddToCart(CartItemDTO item);
        List<CartItem> GetCartItems(int userId);
        bool RemoveFromCart(int userId, int bookId);
        bool UpdateQuantity(CartItemDTO item);
        bool ClearCart(int userId);


    }
}
