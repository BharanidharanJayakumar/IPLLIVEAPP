//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace IPLLive.API.Models
//{
//    public class BattingPerformance
//    {
//        [Key]
//        public int BattingPerformanceId { get; set; }

//        public int InningsId { get; set; }
//        public Innings Innings { get; set; }

//        public int PlayerId { get; set; }
//        public Player Player { get; set; }

//        public int Runs { get; set; } = 0;

//        public int BallsFaced { get; set; } = 0;

//        public int Fours { get; set; } = 0;

//        public int Sixes { get; set; } = 0;

//        [NotMapped]
//        public decimal StrikeRate => BallsFaced > 0 ? (decimal)Runs * 100 / BallsFaced : 0;

//        [StringLength(50)]
//        public string DismissalType { get; set; } // Bowled, Caught, etc.

//        public int? BowledById { get; set; }

//        [ForeignKey("BowledById")]
//        public Player BowledBy { get; set; }

//        public int? CaughtById { get; set; }

//        [ForeignKey("CaughtById")]
//        public Player CaughtBy { get; set; }

//        public int BattingPosition { get; set; }

//        public bool IsNotOut { get; set; }
//    }
//}
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPLLive.API.Models
{
    public class BattingPerformance
    {
        [Key]
        public int BattingPerformanceId { get; set; }

        public int InningsId { get; set; }
        [ForeignKey("InningsId")]
        public Innings Innings { get; set; }

        public int PlayerId { get; set; }
        [ForeignKey("PlayerId")]
        public Player Player { get; set; }

        public int Runs { get; set; } = 0;

        public int BallsFaced { get; set; } = 0;

        public int Fours { get; set; } = 0;

        public int Sixes { get; set; } = 0;

        [NotMapped]
        public decimal StrikeRate => BallsFaced > 0 ? (decimal)Runs * 100 / BallsFaced : 0;

        [StringLength(50)]
        public string DismissalType { get; set; } // Bowled, Caught, etc.

        public int? BowledById { get; set; }
        [ForeignKey("BowledById")]
        public Player BowledBy { get; set; }

        public int? CaughtById { get; set; }
        [ForeignKey("CaughtById")]
        public Player CaughtBy { get; set; }

        public int BattingPosition { get; set; }

        public bool IsNotOut { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public DateTime? DateUpdated { get; set; }
    }
}
