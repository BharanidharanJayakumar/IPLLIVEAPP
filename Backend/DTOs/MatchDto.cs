using IPLLive.API.Models.Enums;
using System;
using System.Collections.Generic;

namespace IPLLive.API.DTOs
{
    public class MatchDto
    {
        public int MatchId { get; set; }
        public int SeasonId { get; set; }
        public string SeasonName { get; set; }
        public int HomeTeamId { get; set; }
        public string HomeTeamName { get; set; }
        public string HomeTeamLogo { get; set; }
        public int AwayTeamId { get; set; }
        public string AwayTeamName { get; set; }
        public string AwayTeamLogo { get; set; }
        public int VenueId { get; set; }
        public string VenueName { get; set; }
        public DateTime ScheduledDateTime { get; set; }
        public MatchStatus Status { get; set; }
        public int? WinnerTeamId { get; set; }
        public string WinnerTeamName { get; set; }
        public string WinMargin { get; set; }
        public string TossWinner { get; set; }
        public string TossDecision { get; set; }
        public List<InningsDto> Innings { get; set; } = new List<InningsDto>();
    }
}
