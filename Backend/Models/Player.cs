using IPLLive.API.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPLLive.API.Models
{
    public class Player
    {
        [Key]
        public int PlayerId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(50)]
        public string CountryCode { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DateOfBirth { get; set; }

        public string ImageUrl { get; set; }

        public PlayerRole Role { get; set; }

        public bool IsOverseasPlayer { get; set; }

        [StringLength(20)]
        public string BattingStyle { get; set; }

        [StringLength(20)]
        public string BowlingStyle { get; set; }

        public int? TeamId { get; set; }
        public Team Team { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties for match statistics
        public ICollection<BattingPerformance> BattingPerformances { get; set; }
        public ICollection<BowlingPerformance> BowlingPerformances { get; set; }

        public Player()
        {
            BattingPerformances = new HashSet<BattingPerformance>();
            BowlingPerformances = new HashSet<BowlingPerformance>();
        }
    }
}
