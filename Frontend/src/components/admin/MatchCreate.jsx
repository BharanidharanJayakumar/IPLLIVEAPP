
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getTeams, getUmpires, createMatch, getPlayers, getSeasons } from '../../services/api';
// import { venues } from '../../data/venues'; // Import the local venues data

// const MatchCreate = () => {
//   const [teams, setTeams] = useState([]); // Initialize as empty array
//   const [venuesList, setVenuesList] = useState([]);
//   const [umpires, setUmpires] = useState([]);
//   const [seasons, setSeasons] = useState([]); // Initialize as empty array
//   const [formData, setFormData] = useState({
//     seasonId: 1,
//     homeTeamId: '',
//     awayTeamId: '',
//     venueId: '',
//     umpireId: '',
//     scheduledDateTime: '',
//     homePlayers: [],
//     awayPlayers: [],
//     winnerTeamId: '', // Optional, for manual entry
//     tossWinnerTeamId: '', // Optional, for manual entry
//     matchNotes: '' // Optional, can include winner/toss details
//   });
//   const [teamPlayers, setTeamPlayers] = useState({ home: [], away: [] });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [teamsRes, umpiresRes, seasonsRes] = await Promise.all([
//         getTeams(),
//         getUmpires(),
//         getSeasons()
//       ]);
//       // Extract $values from the response, default to empty array if not present
//       setTeams(Array.isArray(teamsRes?.$values) ? teamsRes.$values : []);
//       setUmpires(Array.isArray(umpiresRes?.$values) ? umpiresRes.$values : []);
//       setSeasons(Array.isArray(seasonsRes?.$values) ? seasonsRes.$values : []);
//       setVenuesList(venues); // Use local venues data
//       console.log('Fetched teams:', teamsRes); // Debug log
//     } catch (error) {
//       setMessage('Error fetching data');
//       console.error('Fetch data error:', error);
//     }
//   };

//   const fetchPlayers = async (teamId) => {
//     try {
//       const players = await getPlayers();
//       // Ensure players is an array and filter correctly
//       return Array.isArray(players?.$values) ? players.$values.filter(p => p.teamId === parseInt(teamId)) : [];
//     } catch (error) {
//       setMessage('Error fetching players');
//       console.error('Fetch players error:', error);
//       return [];
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (name === 'homeTeamId' || name === 'awayTeamId') {
//       fetchPlayers(value).then(players => {
//         setTeamPlayers(prev => ({
//           ...prev,
//           [name === 'homeTeamId' ? 'home' : 'away']: Array.isArray(players) ? players.slice(0, 15) : []
//         }));
//       });
//     }
//   };

//   const handlePlayerSelect = (team, playerId) => {
//     setFormData(prev => {
//       const currentPlayers = prev[`${team}Players`];
//       if (currentPlayers.includes(playerId)) {
//         return { ...prev, [`${team}Players`]: currentPlayers.filter(id => id !== playerId) };
//       } else if (currentPlayers.length < 11) {
//         return { ...prev, [`${team}Players`]: [...currentPlayers, playerId] };
//       }
//       return prev;
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const matchData = {
//         seasonId: parseInt(formData.seasonId),
//         homeTeamId: parseInt(formData.homeTeamId),
//         awayTeamId: parseInt(formData.awayTeamId),
//         venueId: parseInt(formData.venueId),
//         scheduledDateTime: formData.scheduledDateTime,
//         umpires: formData.umpireId
//           ? [
//               {
//                 umpireId: parseInt(formData.umpireId),
//                 name: umpires.find((u) => u.umpireId === parseInt(formData.umpireId))?.name || "",
//               },
//             ]
//           : [],
//       };
//       console.log('Sending match data:', matchData);
//       await createMatch(matchData);
//       setMessage('Match created successfully!');
//       setTimeout(() => navigate('/admin/match-management'), 2000);
//     } catch (error) {
//       console.error('Match creation error:', error.response?.data || error.message);
//       if (error.response && error.response.status === 400) {
//         setMessage(`Validation error. Details: ${JSON.stringify(error.response.data.errors)} (Check console for full details)`);
//       } else {
//         setMessage('Match creation failed. Check console for details.');
//       }
//     }
//   };

//   return (
//     <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
//       <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Create Match</h1>
//       <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', background: '#1565C0', padding: '25px', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' }}>
//         <select name="seasonId" value={formData.seasonId} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
//           <option value="">Select Season</option>
//           {Array.isArray(seasons) ? seasons.map(season => <option key={season.seasonId} value={season.seasonId}>{season.name}</option>) : <option disabled>No seasons available</option>}
//         </select>
//         <select name="homeTeamId" value={formData.homeTeamId} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
//           <option value="">Select Home Team</option>
//           {Array.isArray(teams) ? teams.map(team => <option key={team.teamId} value={team.teamId}>{team.name}</option>) : <option disabled>No teams available</option>}
//         </select>
//         <select name="awayTeamId" value={formData.awayTeamId} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
//           <option value="">Select Away Team</option>
//           {Array.isArray(teams) ? teams.map(team => <option key={team.teamId} value={team.teamId}>{team.name}</option>) : <option disabled>No teams available</option>}
//         </select>
//         <select name="venueId" value={formData.venueId} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
//           <option value="">Select Venue</option>
//           {venuesList.map(venue => (
//             <option key={venue.VenueId} value={venue.VenueId}>
//               {venue.Name} ({venue.City}, {venue.Country})
//             </option>
//           ))}
//         </select>
//         <select name="umpireId" value={formData.umpireId} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
//           <option value="">Select Umpire</option>
//           {Array.isArray(umpires) ? umpires.map(umpire => <option key={umpire.umpireId} value={umpire.umpireId}>{umpire.name}</option>) : <option disabled>No umpires available</option>}
//         </select>
//         <input type="datetime-local" name="scheduledDateTime" value={formData.scheduledDateTime} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }} />
//         <select name="tossWinnerTeamId" value={formData.tossWinnerTeamId} onChange={handleChange} style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
//           <option value="">Select Toss Winner (Optional)</option>
//           {Array.isArray(teams) ? teams.map(team => <option key={team.teamId} value={team.teamId}>{team.name}</option>) : <option disabled>No teams available</option>}
//         </select>
//         <select name="winnerTeamId" value={formData.winnerTeamId} onChange={handleChange} style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
//           <option value="">Select Winner (Optional)</option>
//           {Array.isArray(teams) ? teams.map(team => <option key={team.teamId} value={team.teamId}>{team.name}</option>) : <option disabled>No teams available</option>}
//         </select>
//         <input type="text" name="umpireName" value={formData.umpireName || ''} onChange={handleChange} placeholder="Umpire Name (Optional)" style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }} />
//         <input type="text" name="matchNotes" value={formData.matchNotes} onChange={handleChange} placeholder="Match Notes (Optional)" style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }} />
//         {['home', 'away'].map(team => (
//           <div key={team} style={{ margin: '25px 0', padding: '20px', background: '#1E88E5', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
//             <h3 style={{ textAlign: 'center', fontSize: '26px', marginBottom: '20px', color: '#BBDEFB', textTransform: 'uppercase' }}>Select {team === 'home' ? 'Home' : 'Away'} 11 Players</h3>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', maxHeight: '400px', overflowY: 'auto', padding: '15px', background: '#42A5F5', borderRadius: '8px' }}>
//               {teamPlayers[team].map(player => (
//                 <label key={player.playerId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px', background: '#64B5F6', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s' }}
//                        onMouseOver={(e) => (e.target.style.transform = 'scale(1.02)')}
//                        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
//                   <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                     <input
//                       type="checkbox"
//                       checked={formData[`${team}Players`].includes(player.playerId)}
//                       onChange={() => handlePlayerSelect(team, player.playerId)}
//                       style={{ marginRight: '15px', transform: 'scale(1.3)', cursor: 'pointer' }}
//                     /> 
//                     <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{player.name}</span>
//                   </div>
//                   <span style={{ fontSize: '16px', color: '#E3F2FD' }}>Country: {player.countryCode}</span>
//                   <span style={{ fontSize: '16px', color: '#E3F2FD' }}>Batting: {player.battingStyle || 'N/A'}</span>
//                   <span style={{ fontSize: '16px', color: '#E3F2FD' }}>Bowling: {player.bowlingStyle || 'N/A'}</span>
//                   <span style={{ fontSize: '16px', color: '#E3F2FD' }}>Status: {player.isOverseasPlayer ? '✈️ Overseas' : 'Local'}</span>
//                 </label>
//               ))}
//             </div>
//             <p style={{ textAlign: 'center', marginTop: '15px', color: '#B0BEC5', fontSize: '18px', fontWeight: 'bold' }}>
//               Selected: {formData[`${team}Players`].length}/11
//             </p>
//           </div>
//         ))}
//         <button type="submit" style={{ width: '100%', padding: '15px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '20px', cursor: 'pointer', transition: 'transform 0.3s', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', marginTop: '20px' }}
//           onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
//           onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
//           Create Match
//         </button>
//         {message && <p style={{ color: '#B0BEC5', marginTop: '15px', textAlign: 'center', fontSize: '18px' }}>{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default MatchCreate;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeams, getUmpires, createMatch, getPlayers, getSeasons } from '../../services/api';
import { venues } from '../../data/venues';

const MatchCreate = () => {
  const [teams, setTeams] = useState([]);
  const [venuesList, setVenuesList] = useState([]);
  const [umpires, setUmpires] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [formData, setFormData] = useState({
    seasonId: 1,
    homeTeamId: '',
    awayTeamId: '',
    venueId: '',
    umpireId: '',
    scheduledDateTime: '',
    homePlayers: [],
    awayPlayers: [],
    winnerTeamId: '',
    tossWinnerTeamId: '',
    matchNotes: ''
  });
  const [teamPlayers, setTeamPlayers] = useState({ home: [], away: [] });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, umpiresRes, seasonsRes] = await Promise.all([
        getTeams(),
        getUmpires(),
        getSeasons()
      ]);
      setTeams(Array.isArray(teamsRes?.$values) ? teamsRes.$values : []);
      setUmpires(Array.isArray(umpiresRes?.$values) ? umpiresRes.$values : []);
      setSeasons(Array.isArray(seasonsRes?.$values) ? seasonsRes.$values : []);
      setVenuesList(venues);
    } catch (error) {
      setMessage('Error fetching data');
      console.error('Fetch data error:', error);
    }
  };

  const fetchPlayers = async (teamId) => {
    try {
      const players = await getPlayers();
      return Array.isArray(players?.$values) ? players.$values.filter(p => p.teamId === parseInt(teamId)) : [];
    } catch (error) {
      setMessage('Error fetching players');
      console.error('Fetch players error:', error);
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'homeTeamId' || name === 'awayTeamId') {
      fetchPlayers(value).then(players => {
        setTeamPlayers(prev => ({
          ...prev,
          [name === 'homeTeamId' ? 'home' : 'away']: Array.isArray(players) ? players.slice(0, 15) : []
        }));
      });
    }
  };

  const handlePlayerSelect = (team, playerId) => {
    setFormData(prev => {
      const currentPlayers = prev[`${team}Players`];
      if (currentPlayers.includes(playerId)) {
        return { ...prev, [`${team}Players`]: currentPlayers.filter(id => id !== playerId) };
      } else if (currentPlayers.length < 11) {
        return { ...prev, [`${team}Players`]: [...currentPlayers, playerId] };
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const matchData = {
        seasonId: parseInt(formData.seasonId),
        homeTeamId: parseInt(formData.homeTeamId),
        awayTeamId: parseInt(formData.awayTeamId),
        venueId: parseInt(formData.venueId),
        scheduledDateTime: formData.scheduledDateTime,
        umpires: formData.umpireId
          ? [{ umpireId: parseInt(formData.umpireId), name: umpires.find(u => u.umpireId === parseInt(formData.umpireId))?.name || "" }]
          : [],
        status: 'Scheduled' // Explicitly set status to 'Scheduled'
      };
      console.log('Sending match data:', matchData);
      await createMatch(matchData);
      setMessage('Match created successfully!');
      setTimeout(() => navigate('/admin/match-management'), 2000);
    } catch (error) {
      console.error('Match creation error:', error.response?.data || error.message);
      if (error.response && error.response.status === 400) {
        setMessage(`Validation error: ${JSON.stringify(error.response.data.errors)}`);
      } else {
        setMessage('Match creation failed. Check console.');
      }
    }
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Create Match</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', background: '#1565C0', padding: '25px', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' }}>
        <select name="seasonId" value={formData.seasonId} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
          <option value="">Select Season</option>
          {Array.isArray(seasons) ? seasons.map(season => <option key={season.seasonId} value={season.seasonId}>{season.name}</option>) : <option disabled>No seasons available</option>}
        </select>
        <select name="homeTeamId" value={formData.homeTeamId} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
          <option value="">Select Home Team</option>
          {Array.isArray(teams) ? teams.map(team => <option key={team.teamId} value={team.teamId}>{team.name}</option>) : <option disabled>No teams available</option>}
        </select>
        <select name="awayTeamId" value={formData.awayTeamId} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
          <option value="">Select Away Team</option>
          {Array.isArray(teams) ? teams.map(team => <option key={team.teamId} value={team.teamId}>{team.name}</option>) : <option disabled>No teams available</option>}
        </select>
        <select name="venueId" value={formData.venueId} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
          <option value="">Select Venue</option>
          {venuesList.map(venue => <option key={venue.VenueId} value={venue.VenueId}>{venue.Name}</option>)}
        </select>
        <select name="umpireId" value={formData.umpireId} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
          <option value="">Select Umpire</option>
          {Array.isArray(umpires) ? umpires.map(umpire => <option key={umpire.umpireId} value={umpire.umpireId}>{umpire.name}</option>) : <option disabled>No umpires available</option>}
        </select>
        <input type="datetime-local" name="scheduledDateTime" value={formData.scheduledDateTime} onChange={handleChange} required style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }} />
        <select name="tossWinnerTeamId" value={formData.tossWinnerTeamId} onChange={handleChange} style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
          <option value="">Select Toss Winner (Optional)</option>
          {Array.isArray(teams) ? teams.map(team => <option key={team.teamId} value={team.teamId}>{team.name}</option>) : <option disabled>No teams available</option>}
        </select>
        <select name="winnerTeamId" value={formData.winnerTeamId} onChange={handleChange} style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }}>
          <option value="">Select Winner (Optional)</option>
          {Array.isArray(teams) ? teams.map(team => <option key={team.teamId} value={team.teamId}>{team.name}</option>) : <option disabled>No teams available</option>}
        </select>
        <input type="text" name="matchNotes" value={formData.matchNotes} onChange={handleChange} placeholder="Match Notes (Optional)" style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '6px', border: 'none', background: '#fff', color: '#000', fontSize: '16px' }} />
        {['home', 'away'].map(team => (
          <div key={team} style={{ margin: '25px 0', padding: '20px', background: '#1E88E5', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <h3 style={{ textAlign: 'center', fontSize: '26px', marginBottom: '20px', color: '#BBDEFB', textTransform: 'uppercase' }}>Select {team === 'home' ? 'Home' : 'Away'} 11 Players</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', maxHeight: '400px', overflowY: 'auto', padding: '15px', background: '#42A5F5', borderRadius: '8px' }}>
              {teamPlayers[team].map(player => (
                <label key={player.playerId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px', background: '#64B5F6', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s' }}
                       onMouseOver={(e) => (e.target.style.transform = 'scale(1.02)')}
                       onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <input
                      type="checkbox"
                      checked={formData[`${team}Players`].includes(player.playerId)}
                      onChange={() => handlePlayerSelect(team, player.playerId)}
                      style={{ marginRight: '15px', transform: 'scale(1.3)', cursor: 'pointer' }}
                    /> 
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{player.name}</span>
                  </div>
                  <span style={{ fontSize: '16px', color: '#E3F2FD' }}>Country: {player.countryCode}</span>
                  <span style={{ fontSize: '16px', color: '#E3F2FD' }}>Batting: {player.battingStyle || 'N/A'}</span>
                  <span style={{ fontSize: '16px', color: '#E3F2FD' }}>Bowling: {player.bowlingStyle || 'N/A'}</span>
                  <span style={{ fontSize: '16px', color: '#E3F2FD' }}>Status: {player.isOverseasPlayer ? '✈️ Overseas' : 'Local'}</span>
                </label>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '15px', color: '#B0BEC5', fontSize: '18px', fontWeight: 'bold' }}>
              Selected: {formData[`${team}Players`].length}/11
            </p>
          </div>
        ))}
        <button type="submit" style={{ width: '100%', padding: '15px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '20px', cursor: 'pointer', transition: 'transform 0.3s', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', marginTop: '20px' }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
          Create Match
        </button>
        {message && <p style={{ color: '#B0BEC5', marginTop: '15px', textAlign: 'center', fontSize: '18px' }}>{message}</p>}
      </form>
    </div>
  );
};

export default MatchCreate;