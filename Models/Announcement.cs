using System;
using System.Collections.Generic;
using System.Linq;

namespace ReadNGo_Group2_C20.Models
{
    public class Announcement
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime PostedOn { get; set; } = DateTime.Now;
    }
}

