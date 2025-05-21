import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SquadSelection = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [players, setPlayers] = useState([]);
  const [squad, setSquad] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get('/teams');
        setTeams(response.data);
      } catch (error) {
        setMessage('Error fetching teams');
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      const fetchPlayers = async () => {
        try {
          const response = await api.get(`/players/team/${selectedTeam}`);
          setPlayers(response.data);
        } catch (error) {
          setMessage('Error fetching players');
        }
      };
      fetchPlayers();
    }
  }, [selectedTeam]);

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
    setSquad([]);
  };

  const handlePlayerToggle = (playerId) => {
    setSquad((prev) => {
      if (prev.includes(playerId)) return prev.filter((id) => id !== playerId);
      if (prev.length < 15) return [...prev, playerId];
      setMessage('Squad can only have 15 players!');
      return prev;
    });
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/players/squad`, { teamId: selectedTeam, playerIds: squad });
      setMessage('Squad updated successfully!');
      navigate('/admin/admin-dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Squad update failed');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)',
      minHeight: '100vh',
      padding: '20px',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Squad Selection</h1>
      <select value={selectedTeam} onChange={handleTeamChange} style={{ width: '200px', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: 'none' }}>
        <option value="">Select Team</option>
        {teams.map((team) => (
          <option key={team.TeamId} value={team.TeamId}>{team.Name}</option>
        ))}
      </select>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {players.map((player) => (
          <div key={player.PlayerId} style={{ padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px' }}>
            <input
              type="checkbox"
              checked={squad.includes(player.PlayerId)}
              onChange={() => handlePlayerToggle(player.PlayerId)}
            />
            {player.Name} ({player.Role})
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} style={{ padding: '12px', backgroundColor: '#D32F2F', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', marginTop: '20px', transition: 'transform 0.3s' }}
        onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
        Save Squad
      </button>
      {message && <p style={{ color: '#B0BEC5', marginTop: '10px', textAlign: 'center' }}>{message}</p>}
    </div>
  );
};

export default SquadSelection;