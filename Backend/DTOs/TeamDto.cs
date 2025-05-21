using System.Collections.Generic;

namespace IPLLive.API.DTOs
{
    public class TeamDto
    {
        public int TeamId { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public string LogoUrl { get; set; }
        public string PrimaryColor { get; set; }
        public string SecondaryColor { get; set; }
        public int? HomeVenueId { get; set; }
        public string HomeVenueName { get; set; }
        public List<PlayerDto> Players { get; set; } = new List<PlayerDto>();
    }
}
