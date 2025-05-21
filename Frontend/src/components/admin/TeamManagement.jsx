import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTeams } from '../../services/api';
import stad4 from '../../assets/stad4.jpg';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const teamRes = await getTeams();
      const teamData = Array.isArray(teamRes?.$values) ? teamRes.$values : [];
      if (teamData.length === 0) {
        setError('No teams found');
      } else {
        teamData.forEach(team => console.log(`Team: ${team.name}, ID: ${team.teamId}`));
        setTeams(teamData);
      }
    } catch (err) {
      setError('Failed to fetch teams');
      console.error(err);
    }
  };

  return (
    <div style={{
      background: `url(${stad4}) no-repeat center center`,
      backgroundSize: 'cover',
      minHeight: '100vh',
      width: '100vw',
      padding: '0',
      margin: '0',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      ':before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1,
      },
    }}>
      <div style={{ padding: '20px', position: 'relative', zIndex: 2 }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '32px',
          marginBottom: '20px',
          color: '#FFFFFF',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
        }}>IPL Dashboard</h1>
        {error && <p style={{ color: '#B0BEC5', textAlign: 'center' }}>{error}</p>}
        {teams.length === 0 && !error && <p style={{ color: '#B0BEC5', textAlign: 'center' }}>Loading...</p>}
        {teams.length > 0 && (
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '15px',
            padding: '0 20px',
            boxSizing: 'border-box',
          }}>
            {teams.map(team => (
              <Link
                to={`/admin/team-details/${team.teamId}`}
                key={team.teamId}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '15px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(5px)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  maxWidth: '250px',
                  height: 'auto',
                  boxSizing: 'border-box',
                  color: '#fff',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.7)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
                }}
              >
                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}>{team.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#FFFFFF',
      textAlign: 'center',
      padding: '10px 0',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 2,
    }}>
      Copyright © IPL 2025. All Rights Reserved.
    </footer>
  );
};

export default TeamManagement;