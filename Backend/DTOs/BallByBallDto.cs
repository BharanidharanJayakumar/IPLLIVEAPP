using IPLLive.API.Models.Enums;
using System;

namespace IPLLive.API.DTOs
{
    public class BallByBallDto
    {
        public int BallId { get; set; }
        public int InningsId { get; set; }
        public decimal OverNumber { get; set; }
        public int BallNumber { get; set; }
        public int BatsmanId { get; set; }
        public string BatsmanName { get; set; }
        public int BowlerId { get; set; }
        public string BowlerName { get; set; }
        public int RunsScored { get; set; }
        public bool IsExtra { get; set; }
        public ExtraType? ExtraType { get; set; }
        public int ExtraRuns { get; set; }
        public bool IsWicket { get; set; }
        public WicketType? WicketType { get; set; }
        public int? PlayerOutId { get; set; }
        public string PlayerOutName { get; set; }
        public int? FielderId { get; set; }
        public string FielderName { get; set; }
        public string Commentary { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
