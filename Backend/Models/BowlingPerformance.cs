using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPLLive.API.Models
{
    public class BowlingPerformance
    {
        [Key]
        public int BowlingPerformanceId { get; set; }

        public int InningsId { get; set; }
        public Innings Innings { get; set; }

        public int PlayerId { get; set; }
        public Player Player { get; set; }

        // Overs are stored as decimal for partial overs (e.g., 4.2 = 4 overs and 2 balls)
        public decimal Overs { get; set; } = 0;

        public int Maidens { get; set; } = 0;

        public int RunsConceded { get; set; } = 0;

        public int Wickets { get; set; } = 0;

        public int Wides { get; set; } = 0;

        public int NoBalls { get; set; } = 0;

        [NotMapped]
        public decimal Economy => Overs > 0 ? RunsConceded / Overs : 0;
    }
}
