using IPLLive.API.Models;
using Microsoft.EntityFrameworkCore;

namespace IPLLive.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Coach> Coaches { get; set; }
        public DbSet<Venue> Venues { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Innings> Innings { get; set; }
        public DbSet<BallByBallData> BallByBallData { get; set; }
        public DbSet<BattingPerformance> BattingPerformances { get; set; }
        public DbSet<BowlingPerformance> BowlingPerformances { get; set; }
        public DbSet<Umpire> Umpires { get; set; }
        public DbSet<PointsTableEntry> PointsTableEntries { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Score> Scores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Team relationships
            modelBuilder.Entity<Team>()
                .HasMany(t => t.Players)
                .WithOne(p => p.Team)
                .HasForeignKey(p => p.TeamId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Team>()
                .HasMany(t => t.Coaches)
                .WithOne(c => c.Team)
                .HasForeignKey(c => c.TeamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Team>()
                .HasOne(t => t.HomeVenue)
                .WithMany(v => v.HomeTeams)
                .HasForeignKey(t => t.HomeVenueId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Match relationships
            modelBuilder.Entity<Match>()
                .HasOne(m => m.HomeTeam)
                .WithMany(t => t.HomeMatches)
                .HasForeignKey(m => m.HomeTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.AwayTeam)
                .WithMany(t => t.AwayMatches)
                .HasForeignKey(m => m.AwayTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure TossWinnerTeam relationship
            modelBuilder.Entity<Match>()
                .HasOne(m => m.TossWinnerTeam)
                .WithMany()
                .HasForeignKey(m => m.TossWinnerTeamId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure WinnerTeam relationship
            modelBuilder.Entity<Match>()
                .HasOne(m => m.WinnerTeam)
                .WithMany()
                .HasForeignKey(m => m.WinnerTeamId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure many-to-many relationship between Match and Umpire
            modelBuilder.Entity<Match>()
                .HasMany(m => m.Umpires)
                .WithMany(u => u.Matches)
                .UsingEntity(j => j.ToTable("MatchUmpires"));

            // Configure Innings relationships
            modelBuilder.Entity<Innings>()
                .HasOne(i => i.BattingTeam)
                .WithMany()
                .HasForeignKey(i => i.BattingTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Innings>()
                .HasOne(i => i.BowlingTeam)
                .WithMany()
                .HasForeignKey(i => i.BowlingTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure BattingPerformance relationships
            modelBuilder.Entity<BattingPerformance>()
                .HasOne(bp => bp.BowledBy)
                .WithMany()
                .HasForeignKey(bp => bp.BowledById)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BattingPerformance>()
                .HasOne(bp => bp.CaughtBy)
                .WithMany()
                .HasForeignKey(bp => bp.CaughtById)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BattingPerformance>()
                .HasOne(bp => bp.Player)
                .WithMany(p => p.BattingPerformances)
                .HasForeignKey(bp => bp.PlayerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure BowlingPerformance relationships
            modelBuilder.Entity<BowlingPerformance>()
                .HasOne(bwp => bwp.Player)
                .WithMany(p => p.BowlingPerformances)
                .HasForeignKey(bwp => bwp.PlayerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure BallByBallData relationships
            modelBuilder.Entity<BallByBallData>()
                .HasOne(b => b.Innings)
                .WithMany(i => i.BallByBallData)
                .HasForeignKey(b => b.InningsId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BallByBallData>()
                .HasOne(b => b.Bowler)
                .WithMany()
                .HasForeignKey(b => b.BowlerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BallByBallData>()
                .HasOne(b => b.Batsman)
                .WithMany()
                .HasForeignKey(b => b.BatsmanId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BallByBallData>()
                .HasOne(b => b.NonStriker)
                .WithMany()
                .HasForeignKey(b => b.NonStrikerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BallByBallData>()
                .HasOne(b => b.PlayerOut)
                .WithMany()
                .HasForeignKey(b => b.PlayerOutId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BallByBallData>()
                .HasOne(b => b.Fielder)
                .WithMany()
                .HasForeignKey(b => b.FielderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Score relationships
            modelBuilder.Entity<Score>()
                .HasOne(s => s.Match)
                .WithMany()
                .HasForeignKey(s => s.MatchId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Score>()
                .HasOne(s => s.Innings)
                .WithMany()
                .HasForeignKey(s => s.InningsId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Score>()
                .HasOne(s => s.Team)
                .WithMany()
                .HasForeignKey(s => s.TeamId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure decimal properties with precision and scale
            modelBuilder.Entity<BowlingPerformance>()
                .Property(b => b.Overs)
                .HasColumnType("decimal(5,2)");

            modelBuilder.Entity<Innings>()
                .Property(i => i.Overs)
                .HasColumnType("decimal(5,2)");

            modelBuilder.Entity<PointsTableEntry>()
                .Property(p => p.AgainstOvers)
                .HasColumnType("decimal(5,2)");

            modelBuilder.Entity<PointsTableEntry>()
                .Property(p => p.ForOvers)
                .HasColumnType("decimal(5,2)");

            modelBuilder.Entity<PointsTableEntry>()
                .Property(p => p.NetRunRate)
                .HasColumnType("decimal(5,2)");

            // Ensure unique username and email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}