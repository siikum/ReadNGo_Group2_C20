using ReadNGo.DTO;
using ReadNGo_Group2_C20.Models; // Required to return the User model
using System;
using static ReadNGo.Services.Implementations.UserService;

namespace ReadNGo.Services.Interfaces
{
    public interface IUserService
    {
        bool Register(UserRegisterDTO user); // changed from bool to User
        //string Login(UserLoginDTO credentials);

        LoginResponse Login(UserLoginDTO credentials);
        UserRegisterDTO GetProfile(int id);
        string GetClaimCode(int orderId);
    }
}