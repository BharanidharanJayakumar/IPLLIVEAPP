// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../services/api';

// const MatchHistory = () => {
//   const [matches, setMatches] = useState([]);

//   useEffect(() => {
//     fetchMatches();
//   }, []);

//   const fetchMatches = async () => {
//     try {
//       const res = await api.get('/api/Match?status=Completed');
//       setMatches(res.data);
//     } catch (err) {
//       console.error('Failed to fetch match history');
//     }
//   };

//   return (
//     <div>
//       <h2>Match History</h2>
//       <ul>
//         {matches.map(match => (
//           <li key={match.matchId}>
//             {match.homeTeamName} vs {match.awayTeamName} - {match.winnerTeamName} won by {match.winMargin}
//             - <Link to={`/user/scorecard/${match.matchId}`}>Scorecard</Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MatchHistory;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const MatchHistory = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/api/Match?status=Completed');
      setMatches(Array.isArray(res.data?.$values) ? res.data.$values : Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setError('Failed to fetch match history');
      console.error(err);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>IPL Match History</h1>
      {error && <p style={{ color: '#B0BEC5', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Past IPL Matches</h2>
        {matches.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {matches.map(match => (
              <li key={match.matchId} style={{ padding: '15px', borderBottom: '1px solid #B0BEC5', transition: 'background 0.3s' }} onMouseOver={e => (e.currentTarget.style.background = '#1976D2')} onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ fontWeight: 'bold' }}>{match.homeTeamName}</span> vs <span style={{ fontWeight: 'bold' }}>{match.awayTeamName}</span> - 
                {match.winnerTeamName && <span style={{ marginLeft: '10px' }}>Winner: {match.winnerTeamName} by {match.winMargin}</span>}
                <Link to={`/user/scorecard/${match.matchId}`} style={{ color: '#D32F2F', marginLeft: '10px', textDecoration: 'none', fontWeight: 'bold' }}>View Scorecard</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', color: '#B0BEC5' }}>No completed matches available</p>
        )}
      </div>
    </div>
  );
};

export default MatchHistory;