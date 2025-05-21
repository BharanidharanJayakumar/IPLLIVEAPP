using System;

namespace IPLLive.API.Models
{
    public class Score
    {
        public int ScoreId { get; set; }
        public int MatchId { get; set; }
        public int InningsId { get; set; }
        public int TeamId { get; set; }
        public int Runs { get; set; }
        public int Wickets { get; set; }
        public int Overs { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Match Match { get; set; }
        public Innings Innings { get; set; }
        public Team Team { get; set; }
    }
}