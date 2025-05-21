using IPLLive.API.Data;
using IPLLive.API.DTOs;
using IPLLive.API.Models;
using IPLLive.API.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly ApplicationDbContext _context;

        public PlayerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PlayerDto>> GetAllPlayersAsync()
        {
            return await _context.Players
                .Include(p => p.Team)
                .Select(p => new PlayerDto
                {
                    PlayerId = p.PlayerId,
                    Name = p.Name,
                    CountryCode = p.CountryCode,
                    DateOfBirth = p.DateOfBirth,
                    ImageUrl = p.ImageUrl,
                    Role = p.Role,
                    IsOverseasPlayer = p.IsOverseasPlayer,
                    BattingStyle = p.BattingStyle,
                    BowlingStyle = p.BowlingStyle,
                    TeamId = p.TeamId,
                    TeamName = p.Team != null ? p.Team.Name : null,
                    IsActive = p.IsActive
                })
                .ToListAsync();
        }

        public async Task<PlayerDto> GetPlayerByIdAsync(int id)
        {
            var player = await _context.Players
                .Include(p => p.Team)
                .FirstOrDefaultAsync(p => p.PlayerId == id);

            if (player == null)
                return null;

            return new PlayerDto
            {
                PlayerId = player.PlayerId,
                Name = player.Name,
                CountryCode = player.CountryCode,
                DateOfBirth = player.DateOfBirth,
                ImageUrl = player.ImageUrl,
                Role = player.Role,
                IsOverseasPlayer = player.IsOverseasPlayer,
                BattingStyle = player.BattingStyle,
                BowlingStyle = player.BowlingStyle,
                TeamId = player.TeamId,
                TeamName = player.Team?.Name,
                IsActive = player.IsActive
            };
        }

        public async Task<IEnumerable<PlayerDto>> GetPlayersByTeamAsync(int teamId)
        {
            return await _context.Players
                .Where(p => p.TeamId == teamId)
                .Include(p => p.Team)
                .Select(p => new PlayerDto
                {
                    PlayerId = p.PlayerId,
                    Name = p.Name,
                    CountryCode = p.CountryCode,
                    DateOfBirth = p.DateOfBirth,
                    ImageUrl = p.ImageUrl,
                    Role = p.Role,
                    IsOverseasPlayer = p.IsOverseasPlayer,
                    BattingStyle = p.BattingStyle,
                    BowlingStyle = p.BowlingStyle,
                    TeamId = p.TeamId,
                    TeamName = p.Team.Name,
                    IsActive = p.IsActive
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<PlayerDto>> GetPlayersByRoleAsync(string role)
        {
            if (!Enum.TryParse<PlayerRole>(role, true, out var playerRole))
                return new List<PlayerDto>();

            return await _context.Players
                .Where(p => p.Role == playerRole)
                .Include(p => p.Team)
                .Select(p => new PlayerDto
                {
                    PlayerId = p.PlayerId,
                    Name = p.Name,
                    CountryCode = p.CountryCode,
                    DateOfBirth = p.DateOfBirth,
                    ImageUrl = p.ImageUrl,
                    Role = p.Role,
                    IsOverseasPlayer = p.IsOverseasPlayer,
                    BattingStyle = p.BattingStyle,
                    BowlingStyle = p.BowlingStyle,
                    TeamId = p.TeamId,
                    TeamName = p.Team != null ? p.Team.Name : null,
                    IsActive = p.IsActive
                })
                .ToListAsync();
        }

        public async Task<Player> CreatePlayerAsync(Player player)
        {
            await _context.Players.AddAsync(player);
            await _context.SaveChangesAsync();
            return player;
        }

        public async Task<Player> UpdatePlayerAsync(Player player)
        {
            _context.Players.Update(player);
            await _context.SaveChangesAsync();
            return player;
        }

        public async Task<bool> DeletePlayerAsync(int id)
        {
            try
            {
                var player = await _context.Players.FindAsync(id);
                if (player == null)
                    return false;

                _context.Players.Remove(player);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
