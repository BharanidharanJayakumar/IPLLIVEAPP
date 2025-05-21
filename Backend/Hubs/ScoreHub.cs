using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace IPLLive.API.Hubs
{
    [Authorize]
    public class ScoreHub : Hub
    {
        public async Task JoinMatch(int matchId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"match_{matchId}");
        }

        public async Task LeaveMatch(int matchId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"match_{matchId}");
        }

        // Admin authorized methods will be invoked from controllers or services
    }
}
