// import React, { useState, useEffect } from 'react';
// import api from '../../services/api';

// const ReportsAnalytics = () => {
//   const [pointsTable, setPointsTable] = useState([]);
//   const [playerStats, setPlayerStats] = useState([]);

//   useEffect(() => {
//     fetchAnalytics();
//   }, []);

//   const fetchAnalytics = async () => {
//     try {
//       const [pointsRes, playerRes] = await Promise.all([
//         api.get('/api/PointTable'),
//         api.get('/api/Player')
//       ]);
//       setPointsTable(pointsRes.data);
//       setPlayerStats(playerRes.data);
//     } catch (err) {
//       console.error('Failed to fetch analytics');
//     }
//   };

//   return (
//     <div>
//       <h2>Reports & Analytics</h2>
//       <h3>Points Table</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Team</th>
//             <th>Played</th>
//             <th>Won</th>
//             <th>Lost</th>
//             <th>Points</th>
//           </tr>
//         </thead>
//         <tbody>
//           {pointsTable.map(entry => (
//             <tr key={entry.pointsTableEntryId}>
//               <td>{entry.team.name}</td>
//               <td>{entry.matchesPlayed}</td>
//               <td>{entry.won}</td>
//               <td>{entry.lost}</td>
//               <td>{entry.points}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <h3>Player Stats</h3>
//       <ul>
//         {playerStats.map(player => (
//           <li key={player.playerId}>{player.name} - {player.teamName}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ReportsAnalytics;
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ReportsAnalytics = () => {
  const [pointsTable, setPointsTable] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [pointsRes, playerRes] = await Promise.all([
        api.get('/api/PointTable'),
        api.get('/api/Player')
      ]);
      setPointsTable(Array.isArray(pointsRes.data?.$values) ? pointsRes.data.$values : Array.isArray(pointsRes.data) ? pointsRes.data : []);
      setPlayerStats(Array.isArray(playerRes.data?.$values) ? playerRes.data.$values : Array.isArray(playerRes.data) ? playerRes.data : []);
    } catch (err) {
      console.error('Failed to fetch analytics');
    }
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Reports & Analytics</h1>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Points Table</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0D47A1' }}>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Team</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Played</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Won</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Lost</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {pointsTable.length > 0 ? (
              pointsTable.map(entry => (
                <tr key={entry.pointsTableEntryId} style={{ borderBottom: '1px solid #B0BEC5' }}>
                  <td style={{ padding: '10px' }}>{entry.team?.name}</td>
                  <td style={{ padding: '10px' }}>{entry.matchesPlayed}</td>
                  <td style={{ padding: '10px' }}>{entry.won}</td>
                  <td style={{ padding: '10px' }}>{entry.lost}</td>
                  <td style={{ padding: '10px' }}>{entry.points}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ padding: '10px', textAlign: 'center' }}>No data available</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ maxWidth: '600px', margin: '20px auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Player Stats</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {playerStats.length > 0 ? (
            playerStats.map(player => (
              <li key={player.playerId} style={{ padding: '10px', borderBottom: '1px solid #B0BEC5' }}>
                {player.name} - {player.team}
              </li>
            ))
          ) : (
            <li style={{ padding: '10px', textAlign: 'center' }}>No player data available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ReportsAnalytics;