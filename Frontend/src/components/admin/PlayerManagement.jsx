import React, { useState, useEffect } from 'react';
import { getPlayers, getTeams, createPlayer, updatePlayerById, deletePlayerById } from '../../services/api';

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', teamId: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editForm, setEditForm] = useState({
    playerId: '',
    name: '',
    teamId: '',
    role: '',
    isActive: true,
    countryCode: '',
    battingStyle: '',
    bowlingStyle: '',
    dateOfBirth: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter players based on search query
    if (searchQuery.trim() === '') {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  }, [searchQuery, players]);

  const fetchData = async () => {
    try {
      const [playerRes, teamRes] = await Promise.all([
        getPlayers(),
        getTeams()
      ]);
      console.log('Raw Player Response:', playerRes);
      console.log('Raw Team Response:', teamRes);

      const fetchedPlayers = Array.isArray(playerRes?.data?.$values) ? playerRes.data.$values :
                            Array.isArray(playerRes?.data) ? playerRes.data :
                            Array.isArray(playerRes?.$values) ? playerRes.$values :
                            Array.isArray(playerRes) ? playerRes : [];
      const fetchedTeams = Array.isArray(teamRes?.data?.$values) ? teamRes.data.$values :
                           Array.isArray(teamRes?.data) ? teamRes.data :
                           Array.isArray(teamRes?.$values) ? teamRes.$values :
                           Array.isArray(teamRes) ? teamRes : [];

      console.log('Parsed Teams:', fetchedTeams);
      console.log('Parsed Players:', fetchedPlayers);
      setPlayers(fetchedPlayers);
      setFilteredPlayers(fetchedPlayers);
      setTeams(fetchedTeams);
      if (fetchedTeams.length === 0) {
        setError('No teams found in the backend. Please add teams to continue.');
      }
      if (fetchedPlayers.length === 0) {
        setError('No players found in the backend. Please add players to continue.');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to fetch data: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPlayer({ ...form, role: 'Batsman', isActive: true });
      fetchData();
      setForm({ name: '', teamId: '' });
      setError('');
    } catch (err) {
      console.error('Create Player Error:', err);
      setError('Failed to create player: ' + (err.message || 'Unknown error'));
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player.playerId);
    setEditForm({
      playerId: player.playerId,
      name: player.name || '',
      teamId: player.teamId || '',
      role: player.role || '',
      isActive: player.isActive || false,
      countryCode: player.countryCode || '',
      battingStyle: player.battingStyle || '',
      bowlingStyle: player.bowlingStyle || '',
      dateOfBirth: player.dateOfBirth ? new Date(player.dateOfBirth).toISOString().split('T')[0] : '',
      imageUrl: player.imageUrl || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Validate Name
      if (!editForm.name || editForm.name.trim() === '') {
        throw new Error('Player Name is required');
      }

      // Validate TeamId
      const teamExists = teams.some(team => team.teamId === parseInt(editForm.teamId));
      if (!teamExists) {
        throw new Error('Selected TeamId does not exist in the database');
      }

      const payload = {
        PlayerId: parseInt(editForm.playerId),
        Name: editForm.name.trim(),
        TeamId: parseInt(editForm.teamId),
        Role: editForm.role || 'Batsman', // Default to 'Batsman' if not provided
        IsActive: editForm.isActive === 'true' || editForm.isActive === true,
        CountryCode: editForm.countryCode || null,
        BattingStyle: editForm.battingStyle || null,
        BowlingStyle: editForm.bowlingStyle || null,
        DateOfBirth: editForm.dateOfBirth ? new Date(editForm.dateOfBirth).toISOString().split('T')[0] : null,
        ImageUrl: editForm.imageUrl || null
      };
      console.log('Update Payload:', JSON.stringify(payload, null, 2));
      await updatePlayerById(editForm.playerId, payload);
      fetchData();
      setEditingPlayer(null);
      setError('');
    } catch (err) {
      console.error('Update Player Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      const validationErrors = err.response?.data?.errors ? 
        (Array.isArray(err.response.data.errors) ? err.response.data.errors.join(', ') : err.response.data.errors) : '';
      setError(`Failed to update player: ${errorMessage}${validationErrors ? ` - ${validationErrors}` : ''}`);
    }
  };

  const handleDelete = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await deletePlayerById(playerId);
        fetchData();
        setError('');
      } catch (err) {
        console.error('Delete Player Error:', err);
        setError('Failed to delete player: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Player Management</h1>
      {error && <p style={{ color: '#B0BEC5', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
      <div style={{ maxWidth: '600px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Search players by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '5px',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
          }}
        />
      </div>
      {teams.length === 0 && !error && <p style={{ color: '#B0BEC5', textAlign: 'center' }}>Loading teams...</p>}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {teams.map(team => (
          <div
            key={team.teamId}
            style={{
              background: '#1565C0',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', color: '#E0E7FF' }}>{team.name}</h2>
            <ul style={{ listStyle: 'none', padding: '0' }}>
              {filteredPlayers
                .filter(player => player.teamId === team.teamId)
                .map(player => (
                  <li key={player.playerId} style={{ padding: '15px', borderBottom: '1px solid #B0BEC5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {editingPlayer === player.playerId ? (
                      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          placeholder="Player Name"
                          style={{ padding: '5px', borderRadius: '5px', border: 'none', outline: 'none' }}
                          required
                        />
                        <select
                          name="teamId"
                          value={editForm.teamId}
                          onChange={handleEditChange}
                          style={{ padding: '5px', borderRadius: '5px', border: 'none', outline: 'none' }}
                          required
                        >
                          <option value="">Select Team</option>
                          {teams.map(t => <option key={t.teamId} value={t.teamId}>{t.name}</option>)}
                        </select>
                        <select
                          name="role"
                          value={editForm.role}
                          onChange={handleEditChange}
                          style={{ padding: '5px', borderRadius: '5px', border: 'none', outline: 'none' }}
                        >
                          <option value="">Select Role</option>
                          <option value="Batsman">Batsman</option>
                          <option value="Bowler">Bowler</option>
                          <option value="AllRounder">All-Rounder</option>
                          <option value="WicketKeeper">Wicket-Keeper</option>
                        </select>
                        <select
                          name="isActive"
                          value={editForm.isActive}
                          onChange={handleEditChange}
                          style={{ padding: '5px', borderRadius: '5px', border: 'none', outline: 'none' }}
                        >
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </select>
                        <input
                          type="text"
                          name="countryCode"
                          value={editForm.countryCode}
                          onChange={handleEditChange}
                          placeholder="Country Code"
                          style={{ padding: '5px', borderRadius: '5px', border: 'none', outline: 'none' }}
                        />
                        <input
                          type="text"
                          name="battingStyle"
                          value={editForm.battingStyle}
                          onChange={handleEditChange}
                          placeholder="Batting Style"
                          style={{ padding: '5px', borderRadius: '5px', border: 'none', outline: 'none' }}
                        />
                        <input
                          type="text"
                          name="bowlingStyle"
                          value={editForm.bowlingStyle}
                          onChange={handleEditChange}
                          placeholder="Bowling Style"
                          style={{ padding: '5px', borderRadius: '5px', border: 'none', outline: 'none' }}
                        />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editForm.dateOfBirth}
                          onChange={handleEditChange}
                          style={{ padding: '5px', borderRadius: '5px', border: 'none', outline: 'none' }}
                        />
                        <input
                          type="text"
                          name="imageUrl"
                          value={editForm.imageUrl}
                          onChange={handleEditChange}
                          placeholder="Image URL"
                          style={{ padding: '5px', borderRadius: '5px', border: 'none', outline: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="submit" style={{ padding: '5px 10px', background: '#1976D2', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPlayer(null)}
                            style={{ padding: '5px 10px', background: '#D32F2F', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#BBDEFB' }}>{player.name}</span>
                          <p style={{ margin: '0', fontSize: '14px', color: '#BBDEFB' }}>Team: {teams.find(t => t.teamId === player.teamId)?.name || 'N/A'}</p>
                          <p style={{ margin: '0', fontSize: '14px', color: '#BBDEFB' }}>Country: {player.countryCode || 'N/A'}</p>
                          <p style={{ margin: '0', fontSize: '14px', color: '#BBDEFB' }}>Role: {player.role || 'N/A'}</p>
                          <p style={{ margin: '0', fontSize: '14px', color: '#BBDEFB' }}>Batting Style: {player.battingStyle || 'N/A'}</p>
                          <p style={{ margin: '0', fontSize: '14px', color: '#BBDEFB' }}>Bowling Style: {player.bowlingStyle || 'N/A'}</p>
                          <p style={{ margin: '0', fontSize: '14px', color: '#BBDEFB' }}>Active: {player.isActive ? 'Yes' : 'No'}</p>
                          <p style={{ margin: '0', fontSize: '14px', color: '#BBDEFB' }}>
                            DOB: {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => handleEdit(player)}
                            style={{ padding: '5px 10px', background: '#1976D2', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(player.playerId)}
                            style={{ padding: '5px 10px', background: '#D32F2F', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: '600px', margin: '20px auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Player</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Player Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ padding: '10px', borderRadius: '5px', border: 'none', outline: 'none' }}
            required
          />
          <select
            value={form.teamId}
            onChange={e => setForm({ ...form, teamId: e.target.value })}
            style={{ padding: '10px', borderRadius: '5px', border: 'none', outline: 'none' }}
            required
          >
            <option value="">Select Team</option>
            {teams.map(team => (
              <option key={team.teamId} value={team.teamId}>{team.name}</option>
            ))}
          </select>
          <button
            type="submit"
            style={{ padding: '10px', background: '#D32F2F', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
          >
            Add Player
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerManagement;