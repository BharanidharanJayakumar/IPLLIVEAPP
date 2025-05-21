using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IPLLive.API.Models
{
    public class Venue
    {
        [Key]
        public int VenueId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(50)]
        public string Country { get; set; }

        public int? Capacity { get; set; }

        public string ImageUrl { get; set; }

        // Navigation properties
        public ICollection<Team> HomeTeams { get; set; }
        public ICollection<Match> Matches { get; set; }

        public Venue()
        {
            HomeTeams = new HashSet<Team>();
            Matches = new HashSet<Match>();
        }
    }
}
