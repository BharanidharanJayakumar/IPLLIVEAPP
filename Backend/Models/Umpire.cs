using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPLLive.API.Models
{
    public class Umpire
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UmpireId { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(10)]
        public string CountryCode { get; set; }

        public string ImageUrl { get; set; }

        public ICollection<Match> Matches { get; set; }

        public Umpire()
        {
            Matches = new HashSet<Match>();
        }
    }
}