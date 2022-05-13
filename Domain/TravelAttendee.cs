using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class TravelAttendee
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public Guid TravelId { get; set; } 
        public Travel Travel { get; set; }
        public bool IsHost { get; set; }
    }
}