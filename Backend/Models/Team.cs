
//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;

//namespace IPLLive.API.Models
//{
//    public class Team
//    {
//        [Key]
//        public int TeamId { get; set; }

//        [Required]
//        [StringLength(100)]
//        public string Name { get; set; }

//        [StringLength(10)]
//        public string ShortName { get; set; }

//        public string LogoUrl { get; set; }

//        [StringLength(50)]
//        public string PrimaryColor { get; set; }

//        [StringLength(50)]
//        public string SecondaryColor { get; set; }

//        public int? HomeVenueId { get; set; }
//        public Venue HomeVenue { get; set; }

//         //Navigation properties
//        public ICollection<Player> Players { get; set; }
//        public ICollection<Coach> Coaches { get; set; }
//        public ICollection<Match> HomeMatches { get; set; }
//        public ICollection<Match> AwayMatches { get; set; }

//        // Constructor
//        public Team()
//        {
//            Players = new HashSet<Player>();
//            Coaches = new HashSet<Coach>();
//            HomeMatches = new HashSet<Match>();
//            AwayMatches = new HashSet<Match>();
//        }
//    }
//}
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPLLive.API.Models
{
    public class Team
    {
        [Key]
        public int TeamId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(10)]
        public string ShortName { get; set; }

        public string LogoUrl { get; set; }

        [StringLength(50)]
        public string PrimaryColor { get; set; }

        [StringLength(50)]
        public string SecondaryColor { get; set; }

        public int? HomeVenueId { get; set; } // Changed to nullable
        [ForeignKey("HomeVenueId")]
        public Venue HomeVenue { get; set; } // Can be null

        // Navigation properties
        public ICollection<Player> Players { get; set; }
        public ICollection<Coach> Coaches { get; set; }
        public ICollection<Match> HomeMatches { get; set; }
        public ICollection<Match> AwayMatches { get; set; }

        public Team()
        {
            Players = new HashSet<Player>();
            Coaches = new HashSet<Coach>();
            HomeMatches = new HashSet<Match>();
            AwayMatches = new HashSet<Match>();
        }
    }
}