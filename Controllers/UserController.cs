using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReadNGo.DBContext;
using ReadNGo.DTO;
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

        //[HttpPost("login")]
        //public IActionResult Login(UserLoginDTO credentials) {
        //    return Ok("user logged in...");
        //}
        //[HttpPost("login")]
        //public IActionResult Login(UserLoginDTO identity)
        //{
        //    var result = _userService.Login(identity);
        //    if (result)
        //        return Ok("User Logged In Successfully");
        //    else
        //        return BadRequest("Invalid email or password");
        //}
        [HttpPost("login")]
        public IActionResult Login(UserLoginDTO credentials)
        {
            var token = _userService.Login(credentials);

            if (token == null)
                return Unauthorized("Invalid email or password.");

            return Ok(new { Token = token });
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