import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTeams, updateTeam, getPlayerById, getPlayersByTeam, getVenues } from '../../services/api';
import { coaches } from '../../data/Coaches';

const TeamDetails = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [captain, setCaptain] = useState(null);
  const [players, setPlayers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    teamId: '',
    name: '',
    shortName: '',
    primaryColor: '',
    secondaryColor: '',
    homeVenueId: '',
    captainId: '',
    logoUrl: '',
    founded: '',
    championships: '',
    description: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [teamId]);

  const fetchData = async () => {
    try {
      const teamsRes = await getTeams();
      const teamsData = Array.isArray(teamsRes?.data?.$values) ? teamsRes.data.$values :
                        Array.isArray(teamsRes?.data) ? teamsRes.data :
                        Array.isArray(teamsRes?.$values) ? teamsRes.$values :
                        Array.isArray(teamsRes) ? teamsRes : [];
      const teamData = teamsData.find(t => t.teamId === parseInt(teamId));
      if (!teamData) {
        throw new Error('Team not found');
      }
      setTeam(teamData);
      setFormData({
        teamId: teamData.teamId || '',
        name: teamData.name || '',
        shortName: teamData.shortName || '',
        primaryColor: teamData.primaryColor || '',
        secondaryColor: teamData.secondaryColor || '',
        homeVenueId: teamData.homeVenueId || '',
        captainId: teamData.captainId || '',
        logoUrl: teamData.logoUrl || '',
        founded: teamData.founded || '',
        championships: teamData.championships || 0,
        description: teamData.description || '',
      });

      if (teamData.captainId) {
        const captainRes = await getPlayerById(teamData.captainId);
        setCaptain(captainRes || { name: 'N/A' });
      } else {
        setCaptain({ name: 'N/A' });
      }

      const playersRes = await getPlayersByTeam(teamId);
      setPlayers(Array.isArray(playersRes?.data?.$values) ? playersRes.data.$values :
                 Array.isArray(playersRes?.data) ? playersRes.data :
                 Array.isArray(playersRes?.$values) ? playersRes.$values :
                 Array.isArray(playersRes) ? playersRes : []);

      const venuesRes = await getVenues();
      setVenues(Array.isArray(venuesRes?.data?.$values) ? venuesRes.data.$values :
                Array.isArray(venuesRes?.data) ? venuesRes.data :
                Array.isArray(venuesRes?.$values) ? venuesRes.$values :
                Array.isArray(venuesRes) ? venuesRes : []);
    } catch (err) {
      setMessage('Failed to fetch team details: ' + (err.message || 'Unknown error'));
      console.error(err);
    }
  };

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      teamId: team.teamId,
      name: team.name,
      shortName: team.shortName,
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor,
      homeVenueId: team.homeVenueId,
      captainId: team.captainId,
      logoUrl: team.logoUrl,
      founded: team.founded,
      championships: team.championships,
      description: team.description,
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        teamId: parseInt(teamId),
        name: formData.name,
        shortName: formData.shortName || null,
        primaryColor: formData.primaryColor || null,
        secondaryColor: formData.secondaryColor || null,
        homeVenueId: formData.homeVenueId ? parseInt(formData.homeVenueId) : null,
        captainId: formData.captainId ? parseInt(formData.captainId) : null,
        logoUrl: formData.logoUrl || null,
        founded: formData.founded ? parseInt(formData.founded) : null,
        championships: formData.championships ? parseInt(formData.championships) : 0,
        description: formData.description || null,
      };
      console.log('Updating team with data:', payload);

      const response = await updateTeam(teamId, payload);
      console.log('Update response:', response);

      const teamsRes = await getTeams();
      const teamsData = Array.isArray(teamsRes?.data?.$values) ? teamsRes.data.$values :
                        Array.isArray(teamsRes?.data) ? teamsRes.data :
                        Array.isArray(teamsRes?.$values) ? teamsRes.$values :
                        Array.isArray(teamsRes) ? teamsRes : [];
      const updatedTeam = teamsData.find(t => t.teamId === parseInt(teamId));
      if (!updatedTeam) {
        throw new Error('Updated team not found');
      }
      setTeam(updatedTeam);

      if (formData.captainId) {
        const updatedCaptain = await getPlayerById(parseInt(formData.captainId));
        setCaptain(updatedCaptain || { name: 'N/A' });
      } else {
        setCaptain({ name: 'N/A' });
      }

      setEditMode(false);
      setMessage('Team updated successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to update team: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      console.error('Update error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!team) return <p style={{ textAlign: 'center', color: '#B0BEC5' }}>Loading...</p>;

  return (
    <div style={{
      background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)',
      minHeight: '100vh',
      padding: '20px',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>{team.name} Details</h1>
      <button
        onClick={() => navigate('/admin/team-management')}
        style={{
          padding: '10px 20px',
          background: '#1976D2',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '20px',
          transition: 'transform 0.3s',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Back to Teams
      </button>
      {message && <p style={{ color: '#B0BEC5', textAlign: 'center', marginBottom: '20px' }}>{message}</p>}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: '#1565C0',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Team Name:
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: 'none', background: '#fff', color: '#000' }}
                required
              />
            ) : (
              <span style={{ marginLeft: '10px', color: '#BBDEFB' }}>{team.name}</span>
            )}
          </label>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Short Name:
            {editMode ? (
              <input
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: 'none', background: '#fff', color: '#000' }}
              />
            ) : (
              <span style={{ marginLeft: '10px', color: '#BBDEFB' }}>{team.shortName || 'N/A'}</span>
            )}
          </label>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Primary Color:
            {editMode ? (
              <input
                type="text"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: 'none', background: '#fff', color: '#000' }}
              />
            ) : (
              <span style={{ marginLeft: '10px', color: team.primaryColor || '#BBDEFB' }}>{team.primaryColor || 'N/A'}</span>
            )}
          </label>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Secondary Color:
            {editMode ? (
              <input
                type="text"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleChange}
                style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: 'none', background: '#fff', color: '#000' }}
              />
            ) : (
              <span style={{ marginLeft: '10px', color: team.secondaryColor || '#BBDEFB' }}>{team.secondaryColor || 'N/A'}</span>
            )}
          </label>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Founded:
            {editMode ? (
              <input
                type="number"
                name="founded"
                value={formData.founded}
                onChange={handleChange}
                style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: 'none', background: '#fff', color: '#000' }}
              />
            ) : (
              <span style={{ marginLeft: '10px', color: '#BBDEFB' }}>{team.founded || 'N/A'}</span>
            )}
          </label>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Championships Won:
            {editMode ? (
              <input
                type="number"
                name="championships"
                value={formData.championships}
                onChange={handleChange}
                style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: 'none', background: '#fff', color: '#000' }}
              />
            ) : (
              <span style={{ marginLeft: '10px', color: '#BBDEFB' }}>{team.championships || 0}</span>
            )}
          </label>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Captain:
            {editMode ? (
              <select
                name="captainId"
                value={formData.captainId}
                onChange={handleChange}
                style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: 'none', background: '#fff', color: '#000' }}
              >
                <option value="">Select Captain</option>
                {players.map(player => (
                  <option key={player.playerId} value={player.playerId}>{player.name}</option>
                ))}
              </select>
            ) : (
              <span style={{ marginLeft: '10px', color: '#BBDEFB' }}>{captain?.name || 'N/A'}</span>
            )}
          </label>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Coach:
            <span style={{ marginLeft: '10px', color: '#BBDEFB' }}>
              {coaches.find(c => c.CoachId === team.coachId)?.Name || 'N/A'}
            </span>
          </label>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Home Venue:
            {editMode ? (
              <select
                name="homeVenueId"
                value={formData.homeVenueId}
                onChange={handleChange}
                style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: 'none', background: '#fff', color: '#000' }}
              >
                <option value="">Select Venue</option>
                {venues.map(venue => (
                  <option key={venue.VenueId} value={venue.VenueId}>{venue.Name}</option>
                ))}
              </select>
            ) : (
              <span style={{ marginLeft: '10px', color: '#BBDEFB' }}>
                {venues.find(v => v.VenueId === team.homeVenueId)?.Name || 'N/A'}
              </span>
            )}
          </label>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Description:
            {editMode ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: 'none', background: '#fff', color: '#000', width: '80%', height: '60px' }}
              />
            ) : (
              <span style={{ marginLeft: '10px', color: '#BBDEFB' }}>{team.description || 'N/A'}</span>
            )}
          </label>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            Players:
            <button
              onClick={() => navigate(`/admin/team-players/${teamId}`)}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                background: '#1976D2',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'transform 0.3s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              View Players
            </button>
          </p>
          <ul style={{ paddingLeft: '20px' }}>
            {players.map(player => (
              <li key={player.playerId} style={{ color: '#BBDEFB', fontSize: '16px' }}>{player.name}</li>
            ))}
          </ul>
        </div>
        {editMode ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSave} style={{
              padding: '10px',
              background: '#1976D2',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.3s',
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              Save
            </button>
            <button onClick={handleCancel} style={{
              padding: '10px',
              background: '#D32F2F',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.3s',
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={handleEdit} style={{
            padding: '10px 20px',
            background: '#1976D2',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'transform 0.3s',
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;