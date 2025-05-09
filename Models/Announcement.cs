using System;
using System.Collections.Generic;
using System.Linq;

namespace ReadNGo_Group2_C20.Models
{
    public class Announcement
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty; // Add this
        public string Message { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsActive { get; set; } = true;
    }


}

