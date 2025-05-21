using IPLLive.API.DTOs;
using IPLLive.API.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public interface IMatchService
    {
        Task<IEnumerable<MatchDto>> GetAllMatchesAsync();
        Task<MatchDto> GetMatchByIdAsync(int id);
        Task<IEnumerable<MatchDto>> GetMatchesByDateAsync(DateTime date);
        Task<IEnumerable<MatchDto>> GetMatchesByTeamAsync(int teamId);
        Task<IEnumerable<MatchDto>> GetMatchesBySeasonAsync(int seasonId);
        Task<IEnumerable<MatchDto>> GetUpcomingMatchesAsync(int count);
        Task<IEnumerable<MatchDto>> GetRecentMatchesAsync(int count);
        Task<IEnumerable<MatchDto>> GetLiveMatchesAsync();
        Task<Match> CreateMatchAsync(Match match);
        Task<Match> UpdateMatchAsync(Match match);
        Task<bool> DeleteMatchAsync(int id);
    }
}
