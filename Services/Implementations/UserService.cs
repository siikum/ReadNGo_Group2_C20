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
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDTO.Password);
            var user = new User
            {
                FullName = userDTO.FullName,
                Email = userDTO.Email,
                Password = hashedPassword,
                Role = userDTO.Role ?? "Member",
                MembershipId = Guid.NewGuid()
            };
            _context.Users.Add(user);
            _context.SaveChanges();

            return true;
        }

        public class LoginResponse
        {
            public string Token { get; set; }
            public int UserId { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
            public string FullName { get; set; }
        }

        public LoginResponse Login(UserLoginDTO credentials)
        {
            Console.WriteLine($"🔍 Login attempt: {credentials.Email} / {credentials.Password}");

           
            if (credentials.Email == "admins@gmail.com" && credentials.Password == "Admin@1234")
            {
                Console.WriteLine("✅ Admin login matched!");
                var adminToken = GenerateJwtToken("Admin", credentials.Email);
                return new LoginResponse
                {
                    Token = adminToken,
                    UserId = 0, 
                    Email = credentials.Email,
                    Role = "Admin",
                    FullName = "Admin User"
                };
            }

            Console.WriteLine("❌ Admin check failed. Proceeding to DB...");

        
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
            var token = GenerateJwtToken(user.Role, user.Email);

            return new LoginResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role,
                FullName = user.FullName
            };
        }

        private string GenerateJwtToken(string role, string email)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim("email", email),
        new Claim("role", role), // 
            };
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            ) ;

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
            
            return $"CLAIM-CODE-{orderId}";
        }

        public List<AnnouncementDTO> GetAllAnnouncements()
{
    var now = DateTime.UtcNow;
    return _context.Announcements
        .Where(a => a.StartTime <= now && a.EndTime >= now && a.IsActive)
        .OrderByDescending(a => a.StartTime)
        .Select(a => new AnnouncementDTO
        {
            Title = a.Title,
            Message = a.Message,
            StartTime = a.StartTime,
            EndTime = a.EndTime
        })
        .ToList();
}
    }
}