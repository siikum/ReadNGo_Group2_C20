using ReadNGo.DBContext;
using ReadNGo.DTO;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BCrypt.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

namespace ReadNGo.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly ReadNGoContext _context;
        private readonly IConfiguration _configuration;
        public UserService(ReadNGoContext context,IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
        //public bool Login(UserLoginDTO identity)
        //{
        //    var user = _context.Users.FirstOrDefault(a => a.Email == identity.Email);
        //    if (user == null)
        //        return false;
        //    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(identity.Password, user.Password);
        //    return isPasswordValid;

        //}

        public string Login(UserLoginDTO credentials)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == credentials.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(credentials.Password, user.Password))
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]);


            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName)
            }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        public UserRegisterDTO GetProfile(int id) => new();

        public string GetClaimCode(int orderId) => "CLAIM123";
    }
}