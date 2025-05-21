using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IPLLive.API.Models.Dtos
{
    public class MatchCreateDto
    {
        [Required]
        public int SeasonId { get; set; }

        [Required]
        public int HomeTeamId { get; set; }

        [Required]
        public int AwayTeamId { get; set; }

        [Required]
        public int VenueId { get; set; }

        [Required]
        public DateTime ScheduledDateTime { get; set; }

        public ICollection<UmpireCreateDto> Umpires { get; set; } // Optional

        public MatchCreateDto()
        {
            Umpires = new List<UmpireCreateDto>();
        }
    }

    public class UmpireCreateDto
    {
        [Required]
        public int UmpireId { get; set; }

        [StringLength(100)]
        public string Name { get; set; } // Optional
    }
}