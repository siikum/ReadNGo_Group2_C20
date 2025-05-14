using ReadNGo.DTO;
using ReadNGo_Group2_C20.Models; 
using System;
using static ReadNGo.Services.Implementations.UserService;

namespace ReadNGo.Services.Interfaces
{
    public interface IUserService
    {
        bool Register(UserRegisterDTO user); 
       

        LoginResponse Login(UserLoginDTO credentials);
        UserRegisterDTO GetProfile(int id);
        string GetClaimCode(int orderId);

        List<AnnouncementDTO> GetAllAnnouncements();
    }
}