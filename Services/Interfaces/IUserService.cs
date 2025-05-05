using ReadNGo.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace ReadNGo.Services.Interfaces
{
    public interface IUserService
    {
        bool Register(UserRegisterDTO user);
        string Login(UserLoginDTO credentials);
        UserRegisterDTO GetProfile(int id);
        string GetClaimCode(int orderId);
    }
}