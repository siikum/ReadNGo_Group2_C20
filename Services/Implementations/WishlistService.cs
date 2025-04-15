using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Implementations
{
    public class WishlistService : IWishlistService
    {
        public bool AddToWishlist(WishlistDTO item) => true;

        public List<WishlistDTO> GetWishlistByUser(int userId) => new();

        public bool RemoveFromWishlist(int bookId) => true;
    }
}