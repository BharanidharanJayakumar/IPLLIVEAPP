// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getMatches } from '../../services/api';
// import createSignalRConnection from '../../services/signalR';

// const UserDashboard = () => {
//   const [liveMatches, setLiveMatches] = useState([]);

//   useEffect(() => {
//     fetchLiveMatches();
//     const connection = createSignalRConnection('live');
//     connection.on('BallAdded', () => fetchLiveMatches());
//     connection.on('MatchCompleted', () => fetchLiveMatches());
//     return () => connection.stop();
//   }, []);

//   const fetchLiveMatches = async () => {
//     try {
//       const response = await getMatches();
//       setLiveMatches(response.filter(m => m.status === 'Live'));
//     } catch (err) {
//       console.error('Failed to fetch live matches');
//     }
//   };

//   return (
//     <div>
//       <h1>User Dashboard - IPLLive</h1>
//       <h2>Live Matches</h2>
//       <ul>
//         {liveMatches.map(match => (
//           <li key={match.matchId}>
//             {match.homeTeamName} vs {match.awayTeamName} - 
//             <Link to={`/user/scorecard/${match.matchId}`}>View Live Score</Link>
//           </li>
//         ))}
//       </ul>
//       <Link to="/user/match-history">Match History</Link> | 
//       <Link to="/user/player-stats">Player Stats</Link> | 
//       <Link to="/user/profile">Profile</Link>
//     </div>
//   );
// };

// export default UserDashboard;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMatches } from '../../services/api';
import createSignalRConnection from '../../services/createSignalRConnection';

const UserDashboard = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLiveMatches();
    const connection = createSignalRConnection('live');
    connection.on('BallAdded', () => fetchLiveMatches());
    connection.on('MatchCompleted', () => fetchLiveMatches());
    return () => connection.stop();
  }, []);

  const fetchLiveMatches = async () => {
    try {
      const response = await getMatches();
      setLiveMatches(Array.isArray(response.data?.$values) ? response.data.$values.filter(m => m.status === 'Live') : Array.isArray(response.data) ? response.data.filter(m => m.status === 'Live') : []);
    } catch (err) {
      console.error('Failed to fetch live matches');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          background: '#D32F2F',
          color: '#fff',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.3s',
        }}
        onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Logout
      </button>
      <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>IPL Live Dashboard</h1>
      <img src="https://via.placeholder.com/300x100.png?text=IPL+Logo" alt="IPL Logo" style={{ display: 'block', margin: '0 auto 20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', transition: 'transform 0.3s' }} onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')} />
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>Live IPL Matches</h2>
        {liveMatches.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {liveMatches.map(match => (
              <li key={match.matchId} style={{ padding: '15px', borderBottom: '1px solid #B0BEC5', transition: 'background 0.3s' }} onMouseOver={e => (e.currentTarget.style.background = '#1976D2')} onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ fontWeight: 'bold' }}>{match.homeTeamName}</span> vs <span style={{ fontWeight: 'bold' }}>{match.awayTeamName}</span> - 
                <Link to={`/user/scorecard/${match.matchId}`} style={{ color: '#D32F2F', marginLeft: '10px', textDecoration: 'none', fontWeight: 'bold' }}>View Live Score</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', color: '#B0BEC5' }}>No live matches currently</p>
        )}
      </div>
      <div style={{ maxWidth: '600px', margin: '20px auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '10px' }}>
        <Link to="/user/match-history" style={{ display: 'inline-block', padding: '10px 20px', background: '#D32F2F', color: '#fff', textDecoration: 'none', borderRadius: '5px', transition: 'transform 0.3s' }} onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}>Past Matches</Link>
        <Link to="/user/live-scores" style={{ display: 'inline-block', padding: '10px 20px', background: '#D32F2F', color: '#fff', textDecoration: 'none', borderRadius: '5px', transition: 'transform 0.3s' }} onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}>Live Scores</Link>
        <Link to="/user/points-table" style={{ display: 'inline-block', padding: '10px 20px', background: '#D32F2F', color: '#fff', textDecoration: 'none', borderRadius: '5px', transition: 'transform 0.3s' }} onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}>Points Table</Link>
        <Link to="/user/player-stats" style={{ display: 'inline-block', padding: '10px 20px', background: '#D32F2F', color: '#fff', textDecoration: 'none', borderRadius: '5px', transition: 'transform 0.3s' }} onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}>Player Stats</Link>
        <Link to="/user/profile" style={{ display: 'inline-block', padding: '10px 20px', background: '#D32F2F', color: '#fff', textDecoration: 'none', borderRadius: '5px', transition: 'transform 0.3s' }} onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}>Profile</Link>
      </div>
    </div>
  );
};

export default UserDashboard;