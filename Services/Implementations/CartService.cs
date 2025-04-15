using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Implementations
{
    public class CartService : ICartService
    {
        public bool AddToCart(CartItemDTO item) => true;

        public List<CartItemDTO> GetCartByUser(int userId) => new();

        public bool RemoveFromCart(int bookId) => true;
    }
}