using IPLLive.API.DTOs;
using IPLLive.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IPLLive.API.Services
{
    public interface IPlayerService
    {
        Task<IEnumerable<PlayerDto>> GetAllPlayersAsync();
        Task<PlayerDto> GetPlayerByIdAsync(int id);
        Task<IEnumerable<PlayerDto>> GetPlayersByTeamAsync(int teamId);
        Task<IEnumerable<PlayerDto>> GetPlayersByRoleAsync(string role);
        Task<Player> CreatePlayerAsync(Player player);
        Task<Player> UpdatePlayerAsync(Player player);
        Task<bool> DeletePlayerAsync(int id);
    }
}
