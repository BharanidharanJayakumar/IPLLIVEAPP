// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getMatch, updateMatch } from '../../services/api';

// const TossManagement = () => {
//   const { matchId } = useParams();
//   const navigate = useNavigate();
//   const [match, setMatch] = useState(null);
//   const [tossWinner, setTossWinner] = useState('');
//   const [tossDecision, setTossDecision] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchMatch();
//   }, []);

//   const fetchMatch = async () => {
//     try {
//       const res = await getMatch(matchId);
//       setMatch(res);
//     } catch (err) {
//       setError('Failed to fetch match');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await updateMatch(matchId, {
//         ...match,
//         tossWinnerTeamId: tossWinner,
//         tossDecision
//       });
//       navigate(`/admin/live-scoring/${matchId}`);
//     } catch (err) {
//       setError('Failed to update toss');
//     }
//   };

//   if (!match) return <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>;

//   return (
//     <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
//       <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Toss Management - {match.homeTeam.name} vs {match.awayTeam.name}</h1>
//       {error && <p style={{ color: '#B0BEC5', textAlign: 'center' }}>{error}</p>}
//       <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
//         <select value={tossWinner} onChange={e => setTossWinner(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}>
//           <option value="">Select Toss Winner</option>
//           <option value={match.homeTeamId}>{match.homeTeam.name}</option>
//           <option value={match.awayTeamId}>{match.awayTeam.name}</option>
//         </select>
//         <select value={tossDecision} onChange={e => setTossDecision(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}>
//           <option value="">Select Decision</option>
//           <option value="Bat">Bat</option>
//           <option value="Field">Field</option>
//         </select>
//         <button type="submit" style={{ width: '100%', padding: '12px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', transition: 'transform 0.3s' }}
//           onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
//           onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
//           Start Match
//         </button>
//       </form>
//     </div>
//   );
// };

// export default TossManagement;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatch, updateMatch } from '../../services/api';

const TossManagement = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatch();
  }, []);

  const fetchMatch = async () => {
    try {
      const res = await getMatch(matchId);
      setMatch(Array.isArray(res?.$values) ? res.$values[0] : res);
    } catch (err) {
      setError('Failed to fetch match');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMatch(matchId, {
        matchId: parseInt(matchId),
        tossWinnerTeamId: parseInt(tossWinner),
        tossDecision,
        status: 1,
      });
      navigate(`/admin/live-scoring/${matchId}`);
    } catch (err) {
      setError('Failed to update toss');
      console.error(err);
    }
  };

  if (!match) return <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>Loading...</div>;

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Toss Management</h1>
      {error && <p style={{ color: '#B0BEC5', textAlign: 'center' }}>{error}</p>}
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{match.homeTeam?.name} vs {match.awayTeam?.name}</h2>
        <form onSubmit={handleSubmit}>
          <select value={tossWinner} onChange={e => setTossWinner(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <option value="">Select Toss Winner</option>
            <option value={match.homeTeamId}>{match.homeTeam?.name}</option>
            <option value={match.awayTeamId}>{match.awayTeam?.name}</option>
          </select>
          <select value={tossDecision} onChange={e => setTossDecision(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <option value="">Select Decision</option>
            <option value="Bat">Bat</option>
            <option value="Field">Field</option>
          </select>
          <button type="submit" style={{ display: 'block', width: '100%', padding: '10px', background: '#D32F2F', color: '#fff', textAlign: 'center', textDecoration: 'none', borderRadius: '5px' }}>Start Match</button>
        </form>
      </div>
    </div>
  );
};

export default TossManagement;