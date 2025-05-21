import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMatches, getTeams, getVenues } from '../../services/api';

const MatchManagement = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matchRes, teamRes, venueRes] = await Promise.all([getMatches(), getTeams(), getVenues()]);
      setMatches(Array.isArray(matchRes?.data?.$values) ? matchRes.data.$values :
                 Array.isArray(matchRes?.data) ? matchRes.data :
                 Array.isArray(matchRes?.$values) ? matchRes.$values :
                 Array.isArray(matchRes) ? matchRes : []);
      setTeams(Array.isArray(teamRes?.data?.$values) ? teamRes.data.$values :
               Array.isArray(teamRes?.data) ? teamRes.data :
               Array.isArray(teamRes?.$values) ? teamRes.$values :
               Array.isArray(teamRes) ? teamRes : []);
      setVenues(Array.isArray(venueRes?.data?.$values) ? venueRes.data.$values :
                Array.isArray(venueRes?.data) ? venueRes.data :
                Array.isArray(venueRes?.$values) ? venueRes.$values :
                Array.isArray(venueRes) ? venueRes : []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    }
  };

  const scheduledMatches = matches.filter(m => m.status === 0 || m.status === 'Scheduled');
  const completedMatches = matches.filter(m => m.status === 3 || m.status === 'Completed');

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Match Management</h1>
      {error && <p style={{ color: '#B0BEC5', textAlign: 'center' }}>{error}</p>}
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Options</h2>
        <Link to="/admin/match-create" style={{ display: 'block', padding: '10px', background: '#D32F2F', color: '#fff', textAlign: 'center', textDecoration: 'none', borderRadius: '5px', marginBottom: '10px' }}>Create Match</Link>
        <Link to="/admin/previous-matches" style={{ display: 'block', padding: '10px', background: '#D32F2F', color: '#fff', textAlign: 'center', textDecoration: 'none', borderRadius: '5px' }}>Previous Matches</Link>
      </div>
      <div style={{ maxWidth: '600px', margin: '20px auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Scheduled Matches</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {scheduledMatches.length > 0 ? (
            scheduledMatches.map(match => (
              <li key={match.matchId} style={{ padding: '10px', borderBottom: '1px solid #B0BEC5' }}>
                {teams.find(t => t.teamId === match.homeTeamId)?.name} vs {teams.find(t => t.teamId === match.awayTeamId)?.name}
                - {new Date(match.scheduledDateTime).toLocaleString()}
                <Link to={`/admin/scorecard/${match.matchId}`} style={{ color: '#fff', marginLeft: '10px', textDecoration: 'underline' }}>Start Match</Link>
              </li>
            ))
          ) : (
            <li style={{ padding: '10px', textAlign: 'center' }}>No scheduled matches</li>
          )}
        </ul>
      </div>
      {completedMatches.length > 0 && (
        <div style={{ maxWidth: '600px', margin: '20px auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Completed Matches</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {completedMatches.map(match => (
              <li key={match.matchId} style={{ padding: '10px', borderBottom: '1px solid #B0BEC5' }}>
                {teams.find(t => t.teamId === match.homeTeamId)?.name} vs {teams.find(t => t.teamId === match.awayTeamId)?.name}
                - {new Date(match.scheduledDateTime).toLocaleString()}
                - Winner: {match.winnerTeamName || 'N/A'} (Margin: {match.winMargin || 'N/A'})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MatchManagement;