// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getMatch, endMatch } from '../../services/api';

// const MatchCompletion = () => {
//   const { matchId } = useParams();
//   const navigate = useNavigate();
//   const [match, setMatch] = useState(null);
//   const [winnerTeamId, setWinnerTeamId] = useState('');
//   const [winMargin, setWinMargin] = useState('');

//   useEffect(() => {
//     fetchMatch();
//   }, []);

//   const fetchMatch = async () => {
//     try {
//       const res = await getMatch(matchId);
//       setMatch(res);
//     } catch (err) {
//       console.error('Failed to fetch match');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await endMatch(matchId, { winnerTeamId, winMargin });
//       navigate('/admin-dashboard');
//     } catch (err) {
//       console.error('Failed to end match');
//     }
//   };

//   if (!match) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>Match Completion - {match.homeTeamName} vs {match.awayTeamName}</h2>
//       <form onSubmit={handleSubmit}>
//         <select value={winnerTeamId} onChange={e => setWinnerTeamId(e.target.value)}>
//           <option value="">Select Winner</option>
//           <option value={match.homeTeamId}>{match.homeTeamName}</option>
//           <option value={match.awayTeamId}>{match.awayTeamName}</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Win Margin (e.g., 5 wickets)"
//           value={winMargin}
//           onChange={e => setWinMargin(e.target.value)}
//         />
//         <button type="submit">End Match</button>
//       </form>
//     </div>
//   );
// };

// export default MatchCompletion;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatch, endMatch } from '../../services/api';

const MatchCompletion = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [winnerTeamId, setWinnerTeamId] = useState('');
  const [winMargin, setWinMargin] = useState('');

  useEffect(() => {
    fetchMatch();
  }, []);

  const fetchMatch = async () => {
    try {
      const res = await getMatch(matchId);
      const fetchedMatch = Array.isArray(res?.data?.$values) ? res.data.$values[0] :
                           Array.isArray(res?.data) ? res.data :
                           Array.isArray(res?.$values) ? res.$values[0] :
                           Array.isArray(res) ? res : res;
      setMatch(fetchedMatch);
      setWinnerTeamId(fetchedMatch.winnerTeamId || '');
      setWinMargin(fetchedMatch.winMargin || '');
    } catch (err) {
      console.error('Failed to fetch match:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await endMatch(matchId, { winnerTeamId: winnerTeamId ? parseInt(winnerTeamId) : null, winMargin });
      navigate('/admin/match-management');
    } catch (err) {
      console.error('Failed to end match:', err);
    }
  };

  if (!match) return <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Match Completion - {match.homeTeam?.name} vs {match.awayTeam?.name}</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Match Result</h3>
        <p>First Innings: {match.innings?.$values[0]?.runs}/{match.innings?.$values[0]?.wickets}</p>
        <p>Second Innings: {match.innings?.$values[1]?.runs}/{match.innings?.$values[1]?.wickets}</p>
        <form onSubmit={handleSubmit}>
          <select
            value={winnerTeamId}
            onChange={e => setWinnerTeamId(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px' }}
          >
            <option value="">Select Winner (or Draw)</option>
            <option value={match.homeTeamId}>{match.homeTeam?.name}</option>
            <option value={match.awayTeamId}>{match.awayTeam?.name}</option>
          </select>
          <input
            type="text"
            placeholder="Win Margin (e.g., 5 runs)"
            value={winMargin}
            onChange={e => setWinMargin(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px' }}
            required={winnerTeamId !== ''}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#D32F2F',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
          >
            End Match
          </button>
        </form>
      </div>
    </div>
  );
};

export default MatchCompletion;