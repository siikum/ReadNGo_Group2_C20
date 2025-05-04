 using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DTO;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        [HttpPost("register")]
        public IActionResult Register(UserRegisterDTO user) {
            return Ok("users registered yahoo...");
        }

        [HttpPost("login")]
        public IActionResult Login(UserLoginDTO credentials) {
            return Ok("user logged in...");
        }

        [HttpGet("profile/{id}")]
        public IActionResult GetProfile(int id) {
            return Ok("Get user profile...");
        }

        [HttpGet("claim-code/{orderId}")]
        public IActionResult GetClaimCode(int orderId) {
            return Ok("Get claim code...");
        }
    }

}