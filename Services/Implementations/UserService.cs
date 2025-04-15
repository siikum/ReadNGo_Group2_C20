using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Implementations
{
    public class UserService : IUserService
    {
        public bool Register(UserRegisterDTO user) => true;

        public bool Login(UserLoginDTO credentials) => true;

        public UserRegisterDTO GetProfile(int id) => new();

        public string GetClaimCode(int orderId) => "CLAIM123";
    }
}