
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { getMatch, getPlayers, startInnings, addBall, updateMatch } from '../../services/api'; // Added updateMatch
// import createSignalRConnection from '../../services/signalR';
// import api from '../../services/api';

// const LiveScoring = () => {
//   const { matchId } = useParams();
//   const [match, setMatch] = useState(null);
//   const [innings, setInnings] = useState(null);
//   const [players, setPlayers] = useState([]);
//   const [balls, setBalls] = useState([]);
//   const [ball, setBall] = useState({
//     inningsId: null,
//     overNumber: 1,
//     ballNumber: 1,
//     batsmanId: '',
//     bowlerId: '',
//     nonStrikerId: '',
//     runsScored: 0,
//     isExtra: false,
//     extraType: '',
//     extraRuns: 0,
//     isWicket: false,
//     wicketType: '',
//     playerOutId: ''
//   });
//   const [striker, setStriker] = useState('');
//   const [nonStriker, setNonStriker] = useState('');
//   const [currentBowler, setCurrentBowler] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchMatchData();
//     const connection = createSignalRConnection(matchId);
//     connection.on('ReceiveBallUpdate', (updatedBall) => {
//       setBalls(prev => [...prev, updatedBall]);
//     });
//     return () => connection.stop();
//   }, [matchId]);

//   const fetchMatchData = async () => {
//     try {
//       const [matchRes, playerRes] = await Promise.all([
//         getMatch(matchId),
//         getPlayers()
//       ]);
//       setMatch(matchRes);
//       setPlayers(playerRes);
//       const inningsRes = await api.get(`/api/Score/innings?matchId=${matchId}`);
//       const currentInnings = inningsRes.data[0];
//       setInnings(currentInnings);
//       if (currentInnings) {
//         const ballsRes = await api.get(`/api/BallByBall/innings/${currentInnings.inningsId}`);
//         setBalls(ballsRes.data);
//         setBall(prev => ({ ...prev, inningsId: currentInnings.inningsId }));
//       }
//     } catch (err) {
//       setError('Failed to fetch match data');
//     }
//   };

//   const handleStartInnings = async () => {
//     try {
//       const battingTeamId = match.tossDecision === 'Bat' ? match.tossWinnerTeamId : match.tossWinnerTeamId === match.homeTeamId ? match.awayTeamId : match.homeTeamId;
//       const bowlingTeamId = battingTeamId === match.homeTeamId ? match.awayTeamId : match.homeTeamId;
//       const res = await startInnings({
//         matchId: parseInt(matchId),
//         battingTeamId,
//         bowlingTeamId,
//         inningsNumber: 1,
//         overs: 0,
//         runs: 0,
//         wickets: 0
//       });
//       setInnings(res);
//       await updateMatch(matchId, { ...match, status: 'InProgress' }); // Now defined
//       setBall(prev => ({ ...prev, inningsId: res.inningsId }));
//     } catch (err) {
//       setError('Failed to start innings');
//     }
//   };

//   const handleBallSubmit = async (e) => {
//     e.preventDefault();
//     if (!innings || (Math.floor(innings.overs) >= 8 && (innings.overs % 1 * 10 + 1) > 6)) {
//       setError('Innings completed or not started');
//       return;
//     }

//     try {
//       const ballData = {
//         inningsId: innings.inningsId,
//         overNumber: Math.floor(innings.overs) + 1,
//         ballNumber: (innings.overs % 1 * 10) + 2,
//         batsmanId: striker,
//         bowlerId: currentBowler,
//         nonStrikerId: nonStriker,
//         runsScored: parseInt(ball.runsScored),
//         isExtra: ball.isExtra,
//         extraType: ball.isExtra ? ball.extraType : null,
//         extraRuns: ball.isExtra ? parseInt(ball.extraRuns) : 0,
//         isWicket: ball.isWicket,
//         wicketType: ball.isWicket ? ball.wicketType : null,
//         playerOutId: ball.isWicket ? striker : null,
//         timestamp: new Date().toISOString()
//       };

//       await addBall(ballData);

//       if ((ball.runsScored % 2 === 1 && !ball.isExtra) || ball.ballNumber === 6) {
//         [striker, nonStriker] = [nonStriker, striker];
//         setStriker(nonStriker);
//         setNonStriker(striker);
//       }

//       setBall({
//         inningsId: innings.inningsId,
//         overNumber: Math.floor(innings.overs) + 1,
//         ballNumber: (innings.overs % 1 * 10) + 2,
//         batsmanId: '',
//         bowlerId: '',
//         nonStrikerId: '',
//         runsScored: 0,
//         isExtra: false,
//         extraType: '',
//         extraRuns: 0,
//         isWicket: false,
//         wicketType: '',
//         playerOutId: ''
//       });
//       fetchMatchData();
//     } catch (err) {
//       setError('Failed to add ball');
//     }
//   };

//   const renderScoreGrid = () => {
//     const grid = [];
//     for (let over = 1; over <= 8; over++) {
//       for (let ballNum = 1; ballNum <= 6; ballNum++) {
//         const ballData = balls.find(b => b.overNumber === over && b.ballNumber === ballNum);
//         grid.push(
//           <div
//             key={`${over}-${ballNum}`}
//             onClick={() => {
//               setBall(prev => ({ ...prev, overNumber: over, ballNumber: ballNum }));
//             }}
//             style={{
//               width: '40px',
//               height: '40px',
//               backgroundColor: ballData ? '#D32F2F' : '#42A5F5',
//               color: '#fff',
//               display: 'inline-flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '2px',
//               cursor: 'pointer',
//               borderRadius: '5px'
//             }}
//           >
//             {ballData ? ballData.runsScored : `${over}.${ballNum}`}
//           </div>
//         );
//       }
//     }
//     return grid;
//   };

//   if (!match) return <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>;

//   return (
//     <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
//       <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Live Scoring - {match.homeTeam.name} vs {match.awayTeam.name}</h1>
//       {error && <p style={{ color: '#B0BEC5', textAlign: 'center' }}>{error}</p>}
//       {!innings && <button onClick={handleStartInnings} style={{ padding: '10px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Start Innings</button>}
//       {innings && (
//         <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//           <p style={{ textAlign: 'center', marginBottom: '20px' }}>Score: {innings.runs}/{innings.wickets} ({innings.overs} overs)</p>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '2px', marginBottom: '20px', justifyContent: 'center' }}>
//             {renderScoreGrid()}
//           </div>
//           <form onSubmit={handleBallSubmit} style={{ background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
//             <select value={striker} onChange={e => setStriker(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}>
//               <option value="">Select Striker</option>
//               {players.filter(p => p.teamId === innings.battingTeamId).map(p => <option key={p.playerId} value={p.playerId}>{p.name}</option>)}
//             </select>
//             <select value={nonStriker} onChange={e => setNonStriker(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}>
//               <option value="">Select Non-Striker</option>
//               {players.filter(p => p.teamId === innings.battingTeamId).map(p => <option key={p.playerId} value={p.playerId}>{p.name}</option>)}
//             </select>
//             <select value={currentBowler} onChange={e => setCurrentBowler(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}>
//               <option value="">Select Bowler</option>
//               {players.filter(p => p.teamId === innings.bowlingTeamId).map(p => <option key={p.playerId} value={p.playerId}>{p.name}</option>)}
//             </select>
//             <select value={ball.runsScored} onChange={e => setBall({ ...ball, runsScored: e.target.value })} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}>
//               <option value="0">0</option>
//               <option value="1">1</option>
//               <option value="2">2</option>
//               <option value="3">3</option>
//               <option value="4">4</option>
//               <option value="6">6</option>
//             </select>
//             <label style={{ display: 'block', margin: '10px 0' }}>
//               <input type="checkbox" checked={ball.isExtra} onChange={e => setBall({ ...ball, isExtra: e.target.checked })} /> Extra
//             </label>
//             {ball.isExtra && (
//               <>
//                 <select value={ball.extraType} onChange={e => setBall({ ...ball, extraType: e.target.value })} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}>
//                   <option value="">Select Extra Type</option>
//                   <option value="Wide">Wide</option>
//                   <option value="NoBall">No Ball</option>
//                   <option value="Bye">Bye</option>
//                   <option value="LegBye">Leg Bye</option>
//                 </select>
//                 <input type="number" value={ball.extraRuns} onChange={e => setBall({ ...ball, extraRuns: e.target.value })} placeholder="Extra Runs" style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }} />
//               </>
//             )}
//             <label style={{ display: 'block', margin: '10px 0' }}>
//               <input type="checkbox" checked={ball.isWicket} onChange={e => setBall({ ...ball, isWicket: e.target.checked })} /> Wicket
//             </label>
//             {ball.isWicket && (
//               <select value={ball.wicketType} onChange={e => setBall({ ...ball, wicketType: e.target.value })} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}>
//                 <option value="">Select Wicket Type</option>
//                 <option value="Bowled">Bowled</option>
//                 <option value="Caught">Caught</option>
//                 <option value="LBW">LBW</option>
//                 <option value="RunOut">Run Out</option>
//               </select>
//             )}
//             <button type="submit" style={{ width: '100%', padding: '12px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', transition: 'transform 0.3s' }}
//               onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
//               onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
//               Add Ball
//             </button>
//           </form>
//           <div style={{ textAlign: 'center', marginTop: '20px' }}>
//             <Link to={`/admin/scorecard/${matchId}`} style={{ color: '#fff', textDecoration: 'underline' }}>View Scorecard</Link>
//             <Link to={`/admin/match-completion/${matchId}`} style={{ color: '#fff', marginLeft: '20px', textDecoration: 'underline' }}>End Match</Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LiveScoring;
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../../services/api';

// const LiveScoring = () => {
//   const { matchId } = useParams();
//   const navigate = useNavigate();
//   const [match, setMatch] = useState(null);
//   const [innings, setInnings] = useState([]);
//   const [balls, setBalls] = useState([]);
//   const [currentInnings, setCurrentInnings] = useState(1);
//   const [newBall, setNewBall] = useState({ overNumber: 1, ballNumber: 1, runsScored: 0, isExtra: false, extraType: '', extraRuns: 0, isWicket: false, wicketType: '', commentary: '' });
//   const [summaryVisible, setSummaryVisible] = useState(false);

//   useEffect(() => {
//     fetchScorecard();
//   }, [matchId]);

//   const fetchScorecard = async () => {
//     try {
//       const [matchRes, inningsRes] = await Promise.all([
//         api.get(`/api/Match/${matchId}`),
//         api.get(`/api/Score/innings?matchId=${matchId}`)
//       ]);
//       setMatch(matchRes.data);
//       setInnings(Array.isArray(inningsRes.data?.$values) ? inningsRes.data.$values : []);
//       const ballPromises = inningsRes.data.$values.map(i => api.get(`/api/BallByBall/innings/${i.inningsId}`));
//       const ballResponses = await Promise.all(ballPromises);
//       setBalls(ballResponses.map(res => Array.isArray(res.data?.$values) ? res.data.$values : []).flat());
//     } catch (err) {
//       console.error('Failed to fetch scorecard:', err);
//     }
//   };

//   const handleBallSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post(`/api/BallByBall`, {
//         inningsId: innings.find(i => i.inningsNumber === currentInnings).inningsId,
//         overNumber: newBall.overNumber,
//         ballNumber: newBall.ballNumber,
//         runsScored: newBall.runsScored,
//         isExtra: newBall.isExtra,
//         extraType: newBall.extraType,
//         extraRuns: newBall.extraRuns,
//         isWicket: newBall.isWicket,
//         wicketType: newBall.wicketType,
//         commentary: newBall.commentary
//       });
//       setNewBall({ overNumber: 1, ballNumber: 1, runsScored: 0, isExtra: false, extraType: '', extraRuns: 0, isWicket: false, wicketType: '', commentary: '' });
//       fetchScorecard();
//     } catch (err) {
//       console.error('Failed to add ball:', err);
//     }
//   };

//   const calculateInningsTotal = (innBalls) => {
//     const runs = innBalls.reduce((sum, ball) => sum + ball.runsScored + (ball.isExtra ? ball.extraRuns : 0), 0);
//     const wickets = innBalls.filter(b => b.isWicket).length;
//     return { runs, wickets };
//   };

//   const endInnings = () => {
//     setSummaryVisible(true);
//   };

//   const startNextInnings = () => {
//     setCurrentInnings(2);
//     setSummaryVisible(false);
//   };

//   const completeMatch = () => {
//     navigate(`/admin/match-completion/${matchId}`);
//   };

//   if (!match) return <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>;

//   const currentInningsBalls = balls.filter(b => b.inningsId === innings.find(i => i.inningsNumber === currentInnings)?.inningsId);
//   const { runs, wickets } = calculateInningsTotal(currentInningsBalls);
//   const overs = Math.floor((currentInningsBalls.length - 1) / 6) + (currentInningsBalls.length % 6 ? `.${currentInningsBalls.length % 6}` : '.0');

//   return (
//     <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
//       <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Live Scoring - {match.homeTeam.name} vs {match.awayTeam.name}</h1>
//       <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Innings {currentInnings}</h2>
//       {!summaryVisible ? (
//         <>
//           <form onSubmit={handleBallSubmit} style={{ maxWidth: '600px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
//             <input type="number" value={newBall.overNumber} onChange={e => setNewBall({ ...newBall, overNumber: parseInt(e.target.value) })} placeholder="Over Number" style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }} required />
//             <input type="number" value={newBall.ballNumber} onChange={e => setNewBall({ ...newBall, ballNumber: parseInt(e.target.value) })} placeholder="Ball Number" style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }} required />
//             <input type="number" value={newBall.runsScored} onChange={e => setNewBall({ ...newBall, runsScored: parseInt(e.target.value) })} placeholder="Runs Scored" style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }} required />
//             <label>
//               <input type="checkbox" checked={newBall.isExtra} onChange={e => setNewBall({ ...newBall, isExtra: e.target.checked })} /> Extra
//             </label>
//             {newBall.isExtra && (
//               <>
//                 <select value={newBall.extraType} onChange={e => setNewBall({ ...newBall, extraType: e.target.value })} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}>
//                   <option value="">Select Extra Type</option>
//                   <option value="Wide">Wide</option>
//                   <option value="NoBall">No Ball</option>
//                   <option value="Bye">Bye</option>
//                   <option value="LegBye">Leg Bye</option>
//                 </select>
//                 <input type="number" value={newBall.extraRuns} onChange={e => setNewBall({ ...newBall, extraRuns: parseInt(e.target.value) })} placeholder="Extra Runs" style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }} />
//               </>
//             )}
//             <label>
//               <input type="checkbox" checked={newBall.isWicket} onChange={e => setNewBall({ ...newBall, isWicket: e.target.checked })} /> Wicket
//             </label>
//             {newBall.isWicket && (
//               <select value={newBall.wicketType} onChange={e => setNewBall({ ...newBall, wicketType: e.target.value })} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}>
//                 <option value="">Select Wicket Type</option>
//                 <option value="Bowled">Bowled</option>
//                 <option value="Caught">Caught</option>
//                 <option value="LBW">LBW</option>
//                 <option value="RunOut">Run Out</option>
//                 <option value="Stumped">Stumped</option>
//               </select>
//             )}
//             <input type="text" value={newBall.commentary} onChange={e => setNewBall({ ...newBall, commentary: e.target.value })} placeholder="Commentary" style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }} />
//             <button type="submit" style={{ width: '100%', padding: '12px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', transition: 'transform 0.3s' }}
//                     onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
//                     onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
//               Add Ball
//             </button>
//             <button type="button" onClick={endInnings} style={{ width: '100%', padding: '12px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', transition: 'transform 0.3s', marginTop: '10px' }}
//                     onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
//                     onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
//                     disabled={currentInnings === 2}>
//               End Innings
//             </button>
//           </form>
//           <div style={{ maxWidth: '600px', margin: '20px auto', background: '#1E88E5', padding: '20px', borderRadius: '10px' }}>
//             <h3 style={{ textAlign: 'center', marginBottom: '10px', color: '#BBDEFB' }}>Current Score</h3>
//             <p style={{ textAlign: 'center', fontSize: '18px' }}>Score: {runs}/{wickets} ({overs} overs)</p>
//             <ul style={{ listStyle: 'none', padding: 0 }}>
//               {currentInningsBalls.map(ball => (
//                 <li key={ball.ballId} style={{ padding: '5px 0' }}>
//                   {ball.overNumber}.{ball.ballNumber}: {ball.runsScored} run(s)
//                   {ball.isExtra && `, ${ball.extraType} (${ball.extraRuns})`}
//                   {ball.isWicket && `, ${ball.wicketType}`}
//                   {ball.commentary && ` - ${ball.commentary}`}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </>
//       ) : (
//         <>
//           <div style={{ maxWidth: '600px', margin: '20px auto', background: '#1E88E5', padding: '20px', borderRadius: '10px' }}>
//             <h3 style={{ textAlign: 'center', marginBottom: '10px', color: '#BBDEFB' }}>Innings {currentInnings} Summary</h3>
//             <p style={{ textAlign: 'center', fontSize: '18px' }}>Score: {runs}/{wickets} ({overs} overs)</p>
//           </div>
//           {currentInnings === 1 ? (
//             <button onClick={startNextInnings} style={{ display: 'block', margin: '20px auto', padding: '12px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', transition: 'transform 0.3s' }}
//                     onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
//                     onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
//               Start 2nd Innings
//             </button>
//           ) : (
//             <button onClick={completeMatch} style={{ display: 'block', margin: '20px auto', padding: '12px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', transition: 'transform 0.3s' }}
//                     onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
//                     onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
//               Complete Match
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default LiveScoring;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMatch, getTeams, startInnings, createBallByBall, getBallsByInnings, endInnings } from '../../services/api';

const LiveScoring = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [teams, setTeams] = useState([]);
  const [innings, setInnings] = useState(null);
  const [balls, setBalls] = useState([]);
  const [ballData, setBallData] = useState({
    overNumber: 1,
    ballNumber: 1,
    bowlerId: '',
    batsmanId: '',
    nonStrikerId: '',
    runsScored: 0,
    isWicket: false,
    wicketType: 0,
    playerOutId: '',
    fielderId: '',
    isExtra: false,
    extraType: 0,
    extraRuns: 0,
    commentary: '',
    timestamp: new Date().toISOString(),
  });
  const [error, setError] = useState('');
  const [currentInningsId, setCurrentInningsId] = useState(null);
  const [strikeBatsmanId, setStrikeBatsmanId] = useState(null);
  const [maxBallsPerInnings] = useState(48); // Assuming 48 balls (8 overs) per innings

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matchRes, teamRes] = await Promise.all([getMatch(matchId), getTeams()]);
      setMatch(Array.isArray(matchRes?.$values) ? matchRes.$values[0] : matchRes);
      setTeams(Array.isArray(teamRes?.$values) ? teamRes.$values : []);
      if (!match?.innings?.$values?.length) {
        const newInnings = await startInnings({
          matchId: parseInt(matchId),
          battingTeamId: match.tossWinnerTeamId || match.homeTeamId,
          bowlingTeamId: match.tossWinnerTeamId === match.homeTeamId ? match.awayTeamId : match.homeTeamId,
          inningsNumber: 1,
        });
        setInnings(newInnings);
        setCurrentInningsId(newInnings.inningsId);
        setStrikeBatsmanId(teamRes.$values.find(t => t.teamId === newInnings.battingTeamId)?.players?.$values[0]?.playerId); // Set initial striker
      } else {
        setInnings(match.innings.$values[0]);
        setCurrentInningsId(match.innings.$values[0].inningsId);
        const ballsData = await getBallsByInnings(match.innings.$values[0].inningsId);
        setBalls(Array.isArray(ballsData?.$values) ? ballsData.$values : []);
        // Determine current striker from last ball
        const lastBall = ballsData.$values[ballsData.$values.length - 1];
        setStrikeBatsmanId(lastBall?.nonStrikerId || teamRes.$values.find(t => t.teamId === match.innings.$values[0].battingTeamId)?.players?.$values[0]?.playerId);
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    }
  };

  const handleQuickBall = async (runs) => {
    const newBallData = {
      ...ballData,
      runsScored: runs,
      inningsId: currentInningsId,
      bowler: { playerId: parseInt(ballData.bowlerId) },
      batsman: { playerId: strikeBatsmanId },
      nonStriker: { playerId: ballData.nonStrikerId },
      timestamp: new Date().toISOString(),
    };
    await handleBallSubmit(newBallData, runs % 2 === 1); // Rotate strike on odd runs
  };

  const handleBallSubmit = async (data, rotateStrike = false) => {
    try {
      const ballToCreate = {
        ...data,
        inningsId: currentInningsId,
        bowler: { playerId: parseInt(data.bowlerId) },
        batsman: { playerId: data.batsmanId },
        nonStriker: { playerId: data.nonStrikerId },
        playerOut: data.playerOutId ? { playerId: parseInt(data.playerOutId) } : null,
        fielder: data.fielderId ? { playerId: parseInt(data.fielderId) } : null,
      };
      const newBall = await createBallByBall(ballToCreate);
      setBalls([...balls, newBall]);

      // Update strike
      if (rotateStrike && data.runsScored % 2 === 1 && !data.isWicket) {
        setStrikeBatsmanId(data.nonStrikerId);
        setBallData({ ...data, batsmanId: data.nonStrikerId, nonStrikerId: data.batsmanId, ballNumber: data.ballNumber + 1 });
      } else {
        setBallData({ ...data, ballNumber: data.ballNumber + 1 });
      }

      if (data.ballNumber >= 6) {
        setBallData({ ...data, overNumber: data.overNumber + 1, ballNumber: 1 });
      }
      if (balls.length + 1 >= maxBallsPerInnings) {
        await endInnings(currentInningsId);
        setInnings(null);
        setBalls([]);
        setBallData({
          overNumber: 1,
          ballNumber: 1,
          bowlerId: '',
          batsmanId: strikeBatsmanId,
          nonStrikerId: teams.find(t => t.teamId === innings.battingTeamId)?.players?.$values.find(p => p.playerId !== strikeBatsmanId)?.playerId || '',
          runsScored: 0,
          isWicket: false,
          wicketType: 0,
          playerOutId: '',
          fielderId: '',
          isExtra: false,
          extraType: 0,
          extraRuns: 0,
          commentary: '',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError('Failed to add ball');
      console.error(err);
    }
  };

  const handleEndInnings = async () => {
    try {
      await endInnings(currentInningsId);
      setInnings(null);
      setBalls([]);
      setBallData({
        overNumber: 1,
        ballNumber: 1,
        bowlerId: '',
        batsmanId: strikeBatsmanId,
        nonStrikerId: teams.find(t => t.teamId === innings.battingTeamId)?.players?.$values.find(p => p.playerId !== strikeBatsmanId)?.playerId || '',
        runsScored: 0,
        isWicket: false,
        wicketType: 0,
        playerOutId: '',
        fielderId: '',
        isExtra: false,
        extraType: 0,
        extraRuns: 0,
        commentary: '',
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError('Failed to end innings');
      console.error(err);
    }
  };

  if (!match || !innings) return <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>Loading...</div>;

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Live Scoring</h1>
      {error && <p style={{ color: '#B0BEC5', textAlign: 'center' }}>{error}</p>}
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1565C0', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{teams.find(t => t.teamId === match.homeTeamId)?.name} vs {teams.find(t => t.teamId === match.awayTeamId)?.name}</h2>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Innings {innings.inningsNumber} - {teams.find(t => t.teamId === innings.battingTeamId)?.name}</h3>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>Score: {balls.reduce((sum, b) => sum + b.runsScored + (b.isExtra ? b.extraRuns : 0), 0)}/{balls.filter(b => b.isWicket).length} ({Math.floor((balls.length - 1) / 6) + (balls.length % 6 ? `.${balls.length % 6}` : '.0')} overs)</p>
        <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Ball-by-Ball Updates</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {balls.map(ball => (
            <li key={ball.ballId} style={{ padding: '10px', borderBottom: '1px solid #B0BEC5' }}>
              Over {ball.overNumber}.{ball.ballNumber}: {ball.runsScored} runs{ball.isWicket ? `, Wicket (${ball.wicketType})` : ''}{ball.isExtra ? `, ${ball.extraType} (${ball.extraRuns})` : ''} - {ball.commentary}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Quick Ball Entry</h4>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
            {[1, 2, 3, 4, 6].map(runs => (
              <button key={runs} onClick={() => handleQuickBall(runs)} style={{ padding: '10px', background: '#D32F2F', color: '#fff', borderRadius: '5px' }}>{runs}</button>
            ))}
            <button onClick={() => setBallData({ ...ballData, isExtra: true })} style={{ padding: '10px', background: '#D32F2F', color: '#fff', borderRadius: '5px' }}>Extra</button>
            <button onClick={() => setBallData({ ...ballData, isWicket: true })} style={{ padding: '10px', background: '#D32F2F', color: '#fff', borderRadius: '5px' }}>Wicket</button>
          </div>
          {ballData.isExtra && (
            <>
              <select value={ballData.extraType} onChange={e => setBallData({ ...ballData, extraType: parseInt(e.target.value) })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                <option value="0">Wide</option>
                <option value="1">No Ball</option>
                <option value="2">Bye</option>
              </select>
              <input type="number" value={ballData.extraRuns} onChange={e => setBallData({ ...ballData, extraRuns: parseInt(e.target.value) || 0 })} placeholder="Extra Runs" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }} />
            </>
          )}
          {ballData.isWicket && (
            <>
              <select value={ballData.wicketType} onChange={e => setBallData({ ...ballData, wicketType: parseInt(e.target.value) })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                <option value="0">Bowled</option>
                <option value="1">Caught</option>
                <option value="2">Run Out</option>
              </select>
              <select value={ballData.playerOutId} onChange={e => setBallData({ ...ballData, playerOutId: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                <option value="">Select Player Out</option>
                {teams.flatMap(t => t.players?.$values || []).map(p => <option key={p.playerId} value={p.playerId}>{p.name}</option>)}
              </select>
              <select value={ballData.fielderId} onChange={e => setBallData({ ...ballData, fielderId: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                <option value="">Select Fielder</option>
                {teams.flatMap(t => t.players?.$values || []).map(p => <option key={p.playerId} value={p.playerId}>{p.name}</option>)}
              </select>
            </>
          )}
          <input type="text" value={ballData.commentary} onChange={e => setBallData({ ...ballData, commentary: e.target.value })} placeholder="Commentary" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }} />
          <button onClick={() => handleBallSubmit(ballData)} style={{ display: 'block', width: '100%', padding: '10px', background: '#D32F2F', color: '#fff', textAlign: 'center', textDecoration: 'none', borderRadius: '5px', marginBottom: '10px' }}>Submit Ball</button>
          <button onClick={handleEndInnings} style={{ display: 'block', width: '100%', padding: '10px', background: '#D32F2F', color: '#fff', textAlign: 'center', textDecoration: 'none', borderRadius: '5px' }}>End Innings</button>
        </div>
      </div>
    </div>
  );
};

export default LiveScoring;