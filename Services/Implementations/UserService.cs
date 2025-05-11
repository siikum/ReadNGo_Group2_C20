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
        public UserService(ReadNGoContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public bool Register(UserRegisterDTO userDTO)
        {
            try{
                   string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDTO.Password);
            var user = new User
            {
                FullName = userDTO.FullName,
                Email = userDTO.Email,
                Password = hashedPassword,
                Role=userDTO.Role ?? "Member",
                MembershipId=Guid.NewGuid()
            };
            _context.Users.Add(user);
            _context.SaveChanges();

            return true;

            }catch(Exception ex){
                Console.WriteLine($"Registration error: {ex.Message}");
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");

                return null;
            }
         
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
            Console.WriteLine($"🔍 Login attempt: {credentials.Email} / {credentials.Password}");

            // ✅ 1. Hardcoded Admin Check FIRST
            if (credentials.Email == "admins@gmail.com" && credentials.Password == "Admin@1234")
            {
                Console.WriteLine("✅ Admin login matched!");
                return GenerateJwtToken("Admin", credentials.Email);
            }

            Console.WriteLine("❌ Admin check failed. Proceeding to DB...");

            // ✅ 2. THEN check normal users from database
            var user = _context.Users.FirstOrDefault(u => u.Email == credentials.Email);
            if (user == null)
            {
                Console.WriteLine("❌ No user found in DB");
                return null;
            }

            if (!BCrypt.Net.BCrypt.Verify(credentials.Password, user.Password))
            {
                Console.WriteLine("❌ Password mismatch");
                return null;
            }

            Console.WriteLine("✅ DB user login matched!");
            return GenerateJwtToken(user.Role, user.Email);
        }

        private string GenerateJwtToken(string role, string email)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim("email", email),
        new Claim("role", role) // ✅ Use "role" as literal string
    };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public UserRegisterDTO GetProfile(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return null;

            return new UserRegisterDTO
            {
                FullName = user.FullName,
                Email = user.Email,
                Password = user.Password,
                Role = user.Role
            };
        }

        public string GetClaimCode(int orderId)
        {
            // Return a dummy value for now or implement actual logic
            return $"CLAIM-CODE-{orderId}";
        }
    }
}