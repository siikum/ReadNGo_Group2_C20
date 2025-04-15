using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.DTO
{
    public class BookDTO
    {
        public int Id { get; set; }  // Optional for frontend creation
        public string Title { get; set; }
        public string Author { get; set; }
        public string Genre { get; set; }
        public decimal Price { get; set; }
        public string Language { get; set; }
        public string Format { get; set; }
        public string Publisher { get; set; }
        public DateTime PublicationDate { get; set; }
    }

}