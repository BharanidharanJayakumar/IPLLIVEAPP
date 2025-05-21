using System;
using System.ComponentModel.DataAnnotations;
using IPLLive.API.Models.Enums;

namespace IPLLive.API.Models
{
    public class BallByBallData
    {
        [Key]
        public int BallId { get; set; }

        public int InningsId { get; set; }
        public Innings? Innings { get; set; } // Made nullable

        public int OverNumber { get; set; }

        public int BallNumber { get; set; } // 1-6 in the over

        public int BowlerId { get; set; }
        public Player? Bowler { get; set; } // Made nullable

        public int BatsmanId { get; set; }
        public Player? Batsman { get; set; } // Made nullable

        public int NonStrikerId { get; set; }
        public Player? NonStriker { get; set; } // Made nullable

        public int RunsScored { get; set; } // Excluding extras

        public bool IsWicket { get; set; }

        public WicketType? WicketType { get; set; }

        public int? PlayerOutId { get; set; }
        public Player? PlayerOut { get; set; } // Already nullable

        public int? FielderId { get; set; }
        public Player? Fielder { get; set; } // Already nullable

        public bool IsExtra { get; set; }

        public ExtraType? ExtraType { get; set; }

        public int ExtraRuns { get; set; }

        [StringLength(500)]
        public string Commentary { get; set; }

        public DateTime Timestamp { get; set; }

        public int TotalRuns => RunsScored + ExtraRuns;
    }
}