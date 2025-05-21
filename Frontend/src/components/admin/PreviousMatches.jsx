// import React, { useState, useEffect } from 'react';
// import { getMatches, getTeams } from '../../services/api'; // Added getTeams

// const PreviousMatches = () => {
//   const [matches, setMatches] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [matchRes, teamRes] = await Promise.all([getMatches(), getTeams()]);
//       setMatches(matchRes.filter(m => m.status === 'Completed')); // Filter completed matches
//       setTeams(teamRes);
//     } catch (err) {
//       setError('Failed to fetch data');
//     }
//   };

//   return (
//     <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
//       <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Previous Matches</h1>
//       {error && <p style={{ color: '#B0BEC5', textAlign: 'center' }}>{error}</p>}
//       <div style={{ maxWidth: '600px', margin: '20px auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {matches.map(match => (
//             <li key={match.matchId} style={{ padding: '10px', borderBottom: '1px solid #B0BEC5' }}>
//               {teams.find(t => t.teamId === match.homeTeamId)?.name} vs {teams.find(t => t.teamId === match.awayTeamId)?.name} 
//               - {new Date(match.scheduledDateTime).toLocaleString()} 
//               - Winner: {match.winnerTeamName || 'N/A'} (Margin: {match.winMargin || 'N/A'})
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default PreviousMatches;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMatches, getTeams } from '../../services/api';

const PreviousMatches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matchRes, teamRes] = await Promise.all([getMatches(), getTeams()]);
      setMatches(Array.isArray(matchRes?.$values) ? matchRes.$values.filter(m => m.status === 3) : []);
      setTeams(Array.isArray(teamRes?.$values) ? teamRes.$values : []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Previous Matches</h1>
      {error && <p style={{ color: '#B0BEC5', textAlign: 'center' }}>{error}</p>}
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {matches.length > 0 ? (
            matches.map(match => (
              <li key={match.matchId} style={{ padding: '10px', borderBottom: '1px solid #B0BEC5' }}>
                {teams.find(t => t.teamId === match.homeTeamId)?.name} vs {teams.find(t => t.teamId === match.awayTeamId)?.name}
                - {new Date(match.scheduledDateTime).toLocaleString()}
                - Winner: {match.winnerTeamName || 'N/A'} (Margin: {match.winMargin || 'N/A'})
                <Link to={`/admin/scorecard/${match.matchId}`} style={{ color: '#fff', marginLeft: '10px', textDecoration: 'underline' }}>View Scorecard</Link>
              </li>
            ))
          ) : (
            <li style={{ padding: '10px', textAlign: 'center' }}>No previous matches</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PreviousMatches;