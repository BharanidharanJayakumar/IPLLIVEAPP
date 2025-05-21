import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const PointsTable = () => {
  const [pointsTable, setPointsTable] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    calculatePointsTable();
  }, []);

  const calculatePointsTable = async () => {
    try {
      const matchesRes = await api.get('/api/Match?status=Completed');
      const matches = Array.isArray(matchesRes.data?.$values) ? matchesRes.data.$values : Array.isArray(matchesRes.data) ? matchesRes.data : [];
      const teams = [...new Set(matches.flatMap(m => [m.homeTeamId, m.awayTeamId]))];
      const table = teams.map(teamId => {
        const teamMatches = matches.filter(m => m.homeTeamId === teamId || m.awayTeamId === teamId);
        const won = teamMatches.filter(m => m.winnerTeamId === teamId).length;
        const lost = teamMatches.filter(m => m.winnerTeamId !== teamId && m.winnerTeamId !== null).length;
        const played = teamMatches.length;
        const points = (won * 2) + (lost > 0 ? 0 : 0); // 2 points per win, 0 for loss
        return { teamId, played, won, lost, points, name: matches.find(m => m.homeTeamId === teamId || m.awayTeamId === teamId)?.homeTeamName || 'Unknown' };
      });
      setPointsTable(table.sort((a, b) => b.points - a.points));
      setError('');
    } catch (err) {
      setError('Failed to calculate points table');
      console.error(err);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>IPL Points Table</h1>
      {error && <p style={{ color: '#B0BEC5', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ background: '#0D47A1' }}>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Pos</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Team</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Played</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Won</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Lost</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #fff' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {pointsTable.length > 0 ? (
              pointsTable.map((entry, index) => (
                <tr key={entry.teamId} style={{ borderBottom: '1px solid #B0BEC5', transition: 'background 0.3s' }} onMouseOver={e => (e.currentTarget.style.background = '#1976D2')} onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '10px' }}>{index + 1}</td>
                  <td style={{ padding: '10px' }}>{entry.name}</td>
                  <td style={{ padding: '10px' }}>{entry.played}</td>
                  <td style={{ padding: '10px' }}>{entry.won}</td>
                  <td style={{ padding: '10px' }}>{entry.lost}</td>
                  <td style={{ padding: '10px' }}>{entry.points}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ padding: '10px', textAlign: 'center' }}>No points data available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PointsTable;