using IPLLive.API.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPLLive.API.Models
{
    public class Match
    {
        [Key]
        public int MatchId { get; set; }

        public int SeasonId { get; set; }
        public Season Season { get; set; }

        public int HomeTeamId { get; set; }
        [ForeignKey("HomeTeamId")]
        public Team HomeTeam { get; set; }

        public int AwayTeamId { get; set; }
        [ForeignKey("AwayTeamId")]
        public Team AwayTeam { get; set; }

        public int VenueId { get; set; }
        public Venue Venue { get; set; }

        [Required]
        public DateTime ScheduledDateTime { get; set; }

        [StringLength(50)]
        public string MatchNumber { get; set; } // e.g. "Match 1", "Final"

        public MatchStatus Status { get; set; } = MatchStatus.Scheduled;

        public int? TossWinnerTeamId { get; set; }
        [ForeignKey("TossWinnerTeamId")]
        public Team? TossWinnerTeam { get; set; }

        [StringLength(20)]
        public string? TossDecision { get; set; } // Changed to nullable

        public int? WinnerTeamId { get; set; }
        [ForeignKey("WinnerTeamId")]
        public Team? WinnerTeam { get; set; }

        [StringLength(100)]
        public string? WinMargin { get; set; } // Already nullable, ensure consistency

        [StringLength(255)]
        public string? MatchNotes { get; set; } // Already nullable, ensure consistency

        // Navigation properties
        public ICollection<Innings> Innings { get; set; }
        public ICollection<Umpire> Umpires { get; set; }

        public Match()
        {
            Innings = new HashSet<Innings>();
            Umpires = new HashSet<Umpire>();
        }
    }
}