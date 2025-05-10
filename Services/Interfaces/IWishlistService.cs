using ReadNGo.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Interfaces
{
    public interface IWishlistService
    {
        bool AddToWishlist(WishlistDTO item);
        List<WishlistDTO> GetWishlistByUser(int userId);
        bool RemoveFromWishlist(int userId, int bookId);  
    }
}
