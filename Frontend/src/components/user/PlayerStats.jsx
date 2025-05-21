// import React, { useState, useEffect } from 'react';
// import { getPlayers } from '../../services/api';

// const PlayerStats = () => {
//   const [players, setPlayers] = useState([]);

//   useEffect(() => {
//     fetchPlayers();
//   }, []);

//   const fetchPlayers = async () => {
//     try {
//       const res = await getPlayers();
//       setPlayers(res);
//     } catch (err) {
//       console.error('Failed to fetch player stats');
//     }
//   };

//   return (
//     <div>
//       <h2>Player Stats</h2>
//       <ul>
//         {players.map(player => (
//           <li key={player.playerId}>{player.name} - {player.teamName}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PlayerStats;
import React, { useState, useEffect } from 'react';
import { getPlayers } from '../../services/api';

const PlayerStats = () => {
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await getPlayers();
      setPlayers(Array.isArray(res.data?.$values) ? res.data.$values : Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setError('Failed to fetch player stats');
      console.error(err);
    }
  };

  const handleTeamClick = (teamId) => {
    setSelectedTeam(teamId === selectedTeam ? null : teamId);
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>IPL Player Stats</h1>
      {error && <p style={{ color: '#B0BEC5', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '20px' }}>
        {[...new Set(players.map(p => p.teamId))].map(teamId => {
          const teamPlayers = players.filter(p => p.teamId === teamId);
          return (
            <div
              key={teamId}
              style={{
                width: '180px',
                height: '200px',
                background: '#1565C0',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'center',
                padding: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s',
              }}
              onClick={() => handleTeamClick(teamId)}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={teamPlayers[0]?.imageUrl || 'https://via.placeholder.com/100'} // Placeholder or team image
                alt={`${teamPlayers[0]?.teamName} logo`}
                style={{ width: '100px', height: '100px', marginBottom: '10px', borderRadius: '50%' }}
              />
              <h3 style={{ margin: '0', fontSize: '18px' }}>{teamPlayers[0]?.teamName}</h3>
            </div>
          );
        })}
      </div>
      {selectedTeam && (
        <div style={{ maxWidth: '600px', margin: '20px auto', background: '#1565C0', padding: '20px', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Players - {players.find(p => p.teamId === selectedTeam)?.teamName}</h2>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {players
              .filter(p => p.teamId === selectedTeam)
              .map(player => (
                <li key={player.playerId} style={{ padding: '10px', borderBottom: '1px solid #B0BEC5', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>{player.name}</span>
                  <div style={{ textAlign: 'right' }}>
                    <p>Team: {player.teamName}</p>
                    <p>Role: {player.role}</p>
                    <p>Runs: {player.battingPerformances?.reduce((sum, perf) => sum + (parseInt(perf) || 0), 0) || 0}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;