using ReadNGo.DBContext;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;
using BCrypt.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly ReadNGoContext _context;
        public UserService(ReadNGoContext context)
        {
            _context = context;
        }
        public bool Register(UserRegisterDTO userDTO)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDTO.Password);
            var user = new User
            {
                FullName = userDTO.FullName,
                Email = userDTO.Email,
                Password = hashedPassword
            };
            _context.Users.Add(user);
            _context.SaveChanges();

            return true;
        }

        //public bool Login(UserLoginDTO credentials) => true;
        public bool Login(UserLoginDTO identity)
        {
            var user = _context.Users.FirstOrDefault(a => a.Email == identity.Email);
            if (user == null)
                return false;
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(identity.Password, user.Password);
            return isPasswordValid;

        }

        public UserRegisterDTO GetProfile(int id) => new();

        public string GetClaimCode(int orderId) => "CLAIM123";
    }
}