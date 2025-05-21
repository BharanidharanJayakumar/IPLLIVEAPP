using System;

namespace IPLLive.API.DTOs
{
    public class BowlingPerformanceDto
    {
        public int BowlingPerformanceId { get; set; }
        public int PlayerId { get; set; }
        public string PlayerName { get; set; }
        public int InningsId { get; set; }
        public decimal Overs { get; set; }
        public int Maidens { get; set; }
        public int RunsConceded { get; set; }
        public int Wickets { get; set; }
        public int Wides { get; set; }
        public int NoBalls { get; set; }
        public decimal Economy => Overs > 0 ? Math.Round(RunsConceded / Overs, 2) : 0;
    }
}
