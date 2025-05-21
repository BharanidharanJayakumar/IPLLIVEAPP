using IPLLive.API.Models;
using IPLLive.API.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public class MatchRepository : Repository<Match>, IMatchRepository
    {
        private readonly ApplicationDbContext _db;

        public MatchRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Match>> GetMatchesForDateAsync(DateTime date)
        {
            return await _db.Matches
                .Where(m => m.ScheduledDateTime.Date == date.Date)
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Venue)
                .ToListAsync();
        }

        public async Task<IEnumerable<Match>> GetMatchesByDateAsync(DateTime date)
        {
            return await GetMatchesForDateAsync(date);
        }

        public async Task<IEnumerable<Match>> GetMatchesByTeamAsync(int teamId)
        {
            return await _db.Matches
                .Where(m => m.HomeTeamId == teamId || m.AwayTeamId == teamId)
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Venue)
                .ToListAsync();
        }

        public async Task<IEnumerable<Match>> GetMatchesBySeasonAsync(int seasonId)
        {
            return await _db.Matches
                .Where(m => m.SeasonId == seasonId)
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Venue)
                .OrderBy(m => m.ScheduledDateTime)
                .ToListAsync();
        }

        public async Task<Match> GetMatchWithDetailsAsync(int id)
        {
            return await _db.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Venue)
                .Include(m => m.Season)
                .Include(m => m.Innings)
                    .ThenInclude(i => i.BattingPerformances)
                        .ThenInclude(b => b.Player)
                .Include(m => m.Innings)
                    .ThenInclude(i => i.BowlingPerformances)
                        .ThenInclude(b => b.Player)
                .Include(m => m.Umpires)
                .FirstOrDefaultAsync(m => m.MatchId == id);
        }

        public async Task<IEnumerable<Match>> GetUpcomingMatchesAsync(int count)
        {
            return await _db.Matches
                .Where(m => m.Status == MatchStatus.Scheduled && m.ScheduledDateTime > DateTime.UtcNow)
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Venue)
                .OrderBy(m => m.ScheduledDateTime)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Match>> GetRecentlyCompletedMatchesAsync(int count)
        {
            return await _db.Matches
                .Where(m => m.Status == MatchStatus.Completed)
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Venue)
                .OrderByDescending(m => m.ScheduledDateTime)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Match>> GetLiveMatchesAsync()
        {
            return await _db.Matches
                .Where(m => m.Status == MatchStatus.InProgress)
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Venue)
                .Include(m => m.Innings.OrderByDescending(i => i.InningsId).Take(1))
                .ToListAsync();
        }

        public async Task<IEnumerable<Match>> GetMatchesByQueryAsync(
            Expression<Func<Match, bool>> predicate,
            Func<IQueryable<Match>, IQueryable<Match>> queryModifier = null)
        {
            IQueryable<Match> query = _db.Matches
                .Where(predicate)
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Venue);

            if (queryModifier != null)
            {
                query = queryModifier(query);
            }

            return await query.ToListAsync();
        }
    }
}
