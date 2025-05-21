using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPLLive.API.Models
{
    public class Innings
    {
        [Key]
        public int InningsId { get; set; }

        public int MatchId { get; set; }
        public Match Match { get; set; }

        public int BattingTeamId { get; set; }

        [ForeignKey("BattingTeamId")]
        public Team BattingTeam { get; set; }

        public int BowlingTeamId { get; set; }

        [ForeignKey("BowlingTeamId")]
        public Team BowlingTeam { get; set; }

        public int InningsNumber { get; set; } // 1 or 2

        public int Runs { get; set; } = 0;

        public int Wickets { get; set; } = 0;

        public decimal Overs { get; set; } = 0;

        // Extras
        public int Wides { get; set; } = 0;
        public int NoBalls { get; set; } = 0;
        public int Byes { get; set; } = 0;
        public int LegByes { get; set; } = 0;
        public int PenaltyRuns { get; set; } = 0;

        public bool IsCompleted { get; set; } = false;

        [NotMapped]
        public int Extras => Wides + NoBalls + Byes + LegByes + PenaltyRuns;

        // Navigation properties
        public ICollection<BallByBallData> BallByBallData { get; set; }
        public ICollection<BattingPerformance> BattingPerformances { get; set; }
        public ICollection<BowlingPerformance> BowlingPerformances { get; set; }

        public Innings()
        {
            BallByBallData = new HashSet<BallByBallData>();
            BattingPerformances = new HashSet<BattingPerformance>();
            BowlingPerformances = new HashSet<BowlingPerformance>();
        }
    }
}
