using System.ComponentModel.DataAnnotations;

namespace IPLLive.API.Models
{
    public class Coach
    {
        [Key]
        public int CoachId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(50)]
        public string Role { get; set; } // Head Coach, Batting Coach, etc.

        [StringLength(50)]
        public string CountryCode { get; set; }

        public string ImageUrl { get; set; }

        public int TeamId { get; set; }
        public Team Team { get; set; }
    }
}
