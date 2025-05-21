namespace IPLLive.API.DTOs
{
    public class BattingPerformanceDto
    {
        public int BattingPerformanceId { get; set; }
        public int PlayerId { get; set; }
        public string PlayerName { get; set; }
        public int InningsId { get; set; }
        public int Runs { get; set; }
        public int BallsFaced { get; set; }
        public int Fours { get; set; }
        public int Sixes { get; set; }
        public bool IsNotOut { get; set; }
        public string DismissalType { get; set; }
        public int? BowledById { get; set; }
        public string BowledByName { get; set; }
        public int? CaughtById { get; set; }
        public string CaughtByName { get; set; }
        public decimal StrikeRate => BallsFaced > 0 ? (decimal)Runs / BallsFaced * 100 : 0;
    }
}
