using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ReadNGo.DTO
{
    public class UserRegisterDTO
    {
        [Required]
        public string FullName { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [Required,MinLength(8)]
        public string Password { get; set; }
     
        //public string ConfirmPassword { get; set; }
    }

}