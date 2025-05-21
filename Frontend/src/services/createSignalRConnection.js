// import { HubConnectionBuilder } from '@microsoft/signalr';

// const createSignalRConnection = (matchId) => {
//   const connection = new HubConnectionBuilder()
//     .withUrl(`${process.env.REACT_APP_API_URL}/scorehub`)
//     .withAutomaticReconnect({
//       nextRetryDelayInMilliseconds: (retryContext) => {
//         if (retryContext.previousRetryCount < 3) return 1000; // 1 second for first 3 retries
//         return 5000; // 5 seconds after 3 retries
//       },
//     })
//     .build();

//   connection.onreconnecting((error) => {
//     console.log('Reconnecting...', error);
//   });

//   connection.onreconnected((connectionId) => {
//     console.log('Reconnected with connectionId:', connectionId);
//     connection.invoke('JoinMatch', matchId).catch((err) => console.error('Failed to rejoin match:', err));
//   });

//   connection.onclose((error) => {
//     console.error('Connection closed:', error);
//   });

//   connection.on('BallAdded', (ball) => {
//     console.log('Ball added:', ball);
//     // Dispatch to Redux or update state
//   });

//   connection.on('InningsUpdated', (innings) => {
//     console.log('Innings updated:', innings);
//     // Dispatch to Redux or update state
//   });

//   connection.on('MatchCompleted', (matchId) => {
//     console.log('Match completed:', matchId);
//     // Dispatch to Redux or update state
//   });

//   connection
//     .start()
//     .then(() => {
//       connection.invoke('JoinMatch', matchId).catch((err) => console.error('Failed to join match:', err));
//     })
//     .catch((err) => console.error('SignalR connection failed:', err));

//   return connection;
// };

// export default createSignalRConnection;
import { HubConnectionBuilder } from '@microsoft/signalr';

const createSignalRConnection = (matchId) => {
  const token = localStorage.getItem('token');
  const connection = new HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_API_URL}/scorehub`, {
      accessTokenFactory: () => token || '', // Pass the token for authentication
      skipNegotiation: true, // Try skipping negotiation for WebSocket (if supported by server)
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        if (retryContext.previousRetryCount < 3) return 1000; // 1 second for first 3 retries
        return 5000; // 5 seconds after 3 retries
      },
    })
    .build();

  connection.onreconnecting((error) => {
    console.log('[SignalR] Reconnecting...', error);
  });

  connection.onreconnected((connectionId) => {
    console.log('[SignalR] Reconnected with connectionId:', connectionId);
    if (matchId) {
      connection.invoke('JoinMatch', matchId).catch((err) => console.error('[SignalR] Failed to rejoin match:', err));
    }
  });

  connection.onclose((error) => {
    console.error('[SignalR] Connection closed:', error);
  });

  connection.on('BallAdded', (ball) => {
    console.log('[SignalR] Ball added:', ball);
    // Dispatch to Redux or update state
  });

  connection.on('InningsUpdated', (innings) => {
    console.log('[SignalR] Innings updated:', innings);
    // Dispatch to Redux or update state
  });

  connection.on('MatchCompleted', (matchId) => {
    console.log('[SignalR] Match completed:', matchId);
    // Dispatch to Redux or update state
  });

  connection
    .start()
    .then(() => {
      console.log('[SignalR] Connection started');
      if (matchId) {
        connection.invoke('JoinMatch', matchId).catch((err) => console.error('[SignalR] Failed to join match:', err));
      }
    })
    .catch((err) => console.error('[SignalR] Connection failed:', err));

  return connection;
};

export default createSignalRConnection;