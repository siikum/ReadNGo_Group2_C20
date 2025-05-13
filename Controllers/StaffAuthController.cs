using Microsoft.AspNetCore.Mvc;
using ReadNGo_Group2_C20.DTO;
using ReadNGo_Group2_C20.Services.Interfaces;

namespace ReadNGo_Group2_C20.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffAuthController : ControllerBase
    {
        private readonly IStaffAuthService _staffAuthService;

        public StaffAuthController(IStaffAuthService staffAuthService)
        {
            _staffAuthService = staffAuthService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] StaffLoginDTO loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = _staffAuthService.Login(loginDto);

            if (!response.Success)
            {
                return Unauthorized(new { message = response.Message });
            }

            return Ok(response);
        }
    }
}