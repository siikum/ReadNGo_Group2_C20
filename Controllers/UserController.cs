using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DBContext;
using ReadNGo.DTO;
using ReadNGo.Services.Implementations;
using ReadNGo.Services.Interfaces;
using ReadNGo_Group2_C20.Models;

namespace ReadNGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }


        [HttpPost("register")]
        public IActionResult Register(UserRegisterDTO userDTO)
        {
            var result = _userService.Register(userDTO);
            if (result)
                return Ok("User Registered Successfully");
            else
                return BadRequest("User Registration Failed");
        }


        [HttpPost("login")]
        public IActionResult Login(UserLoginDTO credentials)
        {
            var loginResponse = _userService.Login(credentials);
            if (loginResponse == null)
                return Unauthorized("Invalid email or password.");
            return Ok(loginResponse);
        }


        [HttpGet("profile/{id}")]
        public IActionResult GetProfile(int id)
        {
            return Ok("Get user profile...");
        }

        [HttpGet("claim-code/{orderId}")]
        public IActionResult GetClaimCode(int orderId)
        {
            return Ok("Get claim code...");
        }

        [HttpGet("announcements")]
        [AllowAnonymous] 
        public IActionResult GetAnnouncements()
        {
            try
            {
                var announcements = _userService.GetAllAnnouncements();
                return Ok(announcements);
            }
            catch (System.Exception ex)
            {
                
                System.Console.WriteLine($"Error getting announcements: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching announcements");
            }
        }
    }

}