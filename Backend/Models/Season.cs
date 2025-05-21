using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IPLLive.API.Models
{
    public class Season
    {
        [Key]
        public int SeasonId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } // e.g. "IPL 2023"

        public int Year { get; set; }

        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        // Navigation properties
        public ICollection<Match> Matches { get; set; }
        public ICollection<PointsTableEntry> PointsTable { get; set; }

        public Season()
        {
            Matches = new HashSet<Match>();
            PointsTable = new HashSet<PointsTableEntry>();
        }
    }
}
