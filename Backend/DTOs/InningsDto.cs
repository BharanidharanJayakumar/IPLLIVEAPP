namespace IPLLive.API.DTOs
{
    public class InningsDto
    {
        public int InningsId { get; set; }
        public int MatchId { get; set; }
        public int BattingTeamId { get; set; }
        public string BattingTeamName { get; set; }
        public int BowlingTeamId { get; set; }
        public string BowlingTeamName { get; set; }
        public int InningsNumber { get; set; }
        public int Runs { get; set; }
        public int Wickets { get; set; }
        public decimal Overs { get; set; }
        public int Extras { get; set; }
        public int Wides { get; set; }
        public int NoBalls { get; set; }
        public int Byes { get; set; }
        public int LegByes { get; set; }
        public int PenaltyRuns { get; set; }
        public bool IsCompleted { get; set; }
    }
}
