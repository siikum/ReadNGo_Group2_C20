using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReadNGo.DTO
{
    public class AnnouncementDTO
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime PostedOn { get; set; } = DateTime.Now;
    }

}