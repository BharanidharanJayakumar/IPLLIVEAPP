namespace IPLLive.API.DTOs
{
    public class PointsTableDto
    {
        public int EntryId { get; set; }
        public int SeasonId { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public string TeamLogoUrl { get; set; }
        public int MatchesPlayed { get; set; }
        public int Won { get; set; }
        public int Lost { get; set; }
        public int Tied { get; set; }
        public int NoResult { get; set; }
        public int Points { get; set; }
        public decimal NetRunRate { get; set; }
    }
}
