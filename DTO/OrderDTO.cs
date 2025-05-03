using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ReadNGo.DTO
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<int> BookIds { get; set; }

        [Required]
        public List<string> BookTitles { get; set; } 
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; }
        public bool IsCancelled { get; set; }
    }



}