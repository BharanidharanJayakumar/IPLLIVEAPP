using IPLLive.API.Models.Enums;
using System;

namespace IPLLive.API.DTOs
{
    public class PlayerDto
    {
        public int PlayerId { get; set; }
        public string Name { get; set; }
        public string CountryCode { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string ImageUrl { get; set; }
        public PlayerRole Role { get; set; }
        public bool IsOverseasPlayer { get; set; }
        public string BattingStyle { get; set; }
        public string BowlingStyle { get; set; }
        public int? TeamId { get; set; }
        public string TeamName { get; set; }
        public bool IsActive { get; set; }
    }
}
