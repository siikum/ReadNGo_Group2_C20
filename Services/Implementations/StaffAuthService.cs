using ReadNGo.DBContext;
using ReadNGo_Group2_C20.DTO;
using ReadNGo_Group2_C20.Services.Interfaces;

namespace ReadNGo_Group2_C20.Services.Implementations
{
    public class StaffAuthService : IStaffAuthService
    {
        private readonly ReadNGoContext _context;
        private readonly IJwtService _jwtService;

        public StaffAuthService(ReadNGoContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public StaffLoginResponseDTO Login(StaffLoginDTO loginDto)
        {
            // Find staff by email
            var staff = _context.Staffs.FirstOrDefault(s => s.Email == loginDto.Email);

            if (staff == null)
            {
                return new StaffLoginResponseDTO
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, staff.PasswordHash))
            {
                return new StaffLoginResponseDTO
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            // Generate JWT token
            var token = _jwtService.GenerateToken(staff.Id, staff.Email, staff.FullName, staff.Role);

            return new StaffLoginResponseDTO
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                FullName = staff.FullName,
                Email = staff.Email,
                Role = staff.Role
            };
        }
    }
}