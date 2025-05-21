using System.ComponentModel.DataAnnotations;

namespace IPLLive.API.Models
{
    public class PointsTableEntry
    {
        [Key]
        public int PointsTableEntryId { get; set; }

        public int SeasonId { get; set; }
        public Season Season { get; set; }

        public int TeamId { get; set; }
        public Team Team { get; set; }

        public int MatchesPlayed { get; set; } = 0;
        public int Won { get; set; } = 0;
        public int Lost { get; set; } = 0;
        public int Tied { get; set; } = 0;
        public int NoResult { get; set; } = 0;
        public int Points { get; set; } = 0;
        public decimal NetRunRate { get; set; } = 0;

        // For potential tie-breakers
        public int ForRuns { get; set; } = 0;
        public decimal ForOvers { get; set; } = 0;
        public int AgainstRuns { get; set; } = 0;
        public decimal AgainstOvers { get; set; } = 0;
    }
}
