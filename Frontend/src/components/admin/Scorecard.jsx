import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatch, getTeams, getPlayers } from '../../services/api';

const Scorecard = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [innings, setInnings] = useState([]);
  const [currentInnings, setCurrentInnings] = useState(null);
  const [balls, setBalls] = useState([]);
  const [selectedBallIndex, setSelectedBallIndex] = useState(null);
  const [currentOverBowlerId, setCurrentOverBowlerId] = useState(null);
  const [showBowlerSelection, setShowBowlerSelection] = useState(false);
  const [ballInput, setBallInput] = useState({
    runs: 0,
    isWicket: false,
    wicketType: 0,
    isExtra: false,
    extraType: 0,
    extraRuns: 0,
    commentary: ''
  });
  const [error, setError] = useState('');
  const maxBallsPerInnings = 48;
  const maxWickets = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matchRes, teamsRes, playersRes] = await Promise.all([getMatch(matchId), getTeams(), getPlayers()]);
      const fetchedMatch = Array.isArray(matchRes?.data?.$values) ? matchRes.data.$values[0] :
                           Array.isArray(matchRes?.data) ? matchRes.data :
                           Array.isArray(matchRes?.$values) ? matchRes.$values[0] :
                           Array.isArray(matchRes) ? matchRes : matchRes;
      const fetchedTeams = Array.isArray(teamsRes?.data?.$values) ? teamsRes.data.$values :
                           Array.isArray(teamsRes?.data) ? teamsRes.data :
                           Array.isArray(teamsRes?.$values) ? teamsRes.$values :
                           Array.isArray(teamsRes) ? teamsRes : [];
      const fetchedPlayers = Array.isArray(playersRes?.data?.$values) ? playersRes.data.$values :
                             Array.isArray(playersRes?.data) ? playersRes.data :
                             Array.isArray(playersRes?.$values) ? playersRes.$values :
                             Array.isArray(playersRes) ? playersRes : [];

      console.log('Fetched Match:', fetchedMatch);
      console.log('Fetched Teams:', fetchedTeams);
      console.log('Fetched Players:', fetchedPlayers);

      setMatch(fetchedMatch);
      setTeams(fetchedTeams);
      setPlayers(fetchedPlayers);

      const inningsData = fetchedMatch.innings?.$values || [];
      setInnings(inningsData);

      // Check for existing first innings
      const firstInnings = inningsData.find(i => i.inningsNumber === 1);
      const secondInnings = inningsData.find(i => i.inningsNumber === 2);

      if (!firstInnings) {
        // Create first innings if it doesn't exist
        await startInnings(fetchedMatch.homeTeamId, fetchedMatch.awayTeamId, 1);
        setShowBowlerSelection(true);
      } else if (firstInnings.isCompleted && !secondInnings) {
        // Create second innings if first is completed and second doesn't exist
        await startInnings(fetchedMatch.awayTeamId, fetchedMatch.homeTeamId, 2);
        setShowBowlerSelection(true);
      } else {
        // Use the latest innings as the current innings
        const latestInnings = inningsData[inningsData.length - 1];
        setCurrentInnings(latestInnings);
        await fetchBalls(latestInnings.inningsId);
        if (balls.length % 6 === 0 && balls.length < maxBallsPerInnings && latestInnings.wickets < maxWickets) {
          setShowBowlerSelection(true);
        }
      }
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error(err);
    }
  };

  const startInnings = async (battingTeamId, bowlingTeamId, inningsNumber) => {
    try {
      const payload = {
        battingTeamId,
        bowlingTeamId,
        inningsNumber
      };
      console.log('Starting innings with payload:', payload);
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Token present' : 'No token found');

      const response = await fetch(`https://localhost:5001/api/Match/${matchId}/start-innings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start innings: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const newInnings = await response.json();
      setInnings([...innings, newInnings]);
      setCurrentInnings(newInnings);
      setBalls([]);
    } catch (err) {
      setError('Failed to start innings: ' + err.message);
      console.error(err);
    }
  };

  const fetchBalls = async (inningsId) => {
    try {
      const response = await fetch(`https://localhost:5001/api/Innings/${inningsId}/balls`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch balls');
      const ballsData = await response.json();
      setBalls(Array.isArray(ballsData?.$values) ? ballsData.$values : []);
    } catch (err) {
      console.error('Failed to fetch balls:', err);
    }
  };

  const handleBowlerSelection = (bowlerId) => {
    setCurrentOverBowlerId(bowlerId);
    setShowBowlerSelection(false);
  };

  const handleBallClick = (index) => {
    if (index < balls.length) {
      // Ball already recorded, show details
      return;
    }

    // Check if a bowler is selected for the current over
    if (!currentOverBowlerId) {
      setShowBowlerSelection(true);
      return;
    }

    // Check if the ball is part of a new over
    if (index % 6 === 0 && index > 0 && balls.length === index) {
      setShowBowlerSelection(true);
      return;
    }

    setSelectedBallIndex(index);
    setBallInput({
      runs: 0,
      isWicket: false,
      wicketType: 0,
      isExtra: false,
      extraType: 0,
      extraRuns: 0,
      commentary: ''
    });
  };

  const handleBallInputSubmit = async () => {
    if (selectedBallIndex === null || !currentOverBowlerId) return;

    try {
      // Select valid batsman and non-striker from the batting team
      const battingTeamPlayers = players.filter(p => p.teamId === currentInnings.battingTeamId);
      if (battingTeamPlayers.length < 2) {
        throw new Error('Not enough players in the batting team to select batsman and non-striker.');
      }

      const batsman = battingTeamPlayers[0]; // First player as batsman
      const nonStriker = battingTeamPlayers[1]; // Second player as non-striker

      const ballData = {
        inningsId: currentInnings.inningsId,
        overNumber: Math.floor(selectedBallIndex / 6) + 1,
        ballNumber: (selectedBallIndex % 6) + 1,
        bowlerId: currentOverBowlerId,
        batsmanId: batsman.playerId,
        nonStrikerId: nonStriker.playerId,
        runsScored: ballInput.runs,
        isWicket: ballInput.isWicket,
        wicketType: ballInput.isWicket ? ballInput.wicketType : null,
        playerOutId: ballInput.isWicket ? batsman.playerId : null,
        fielderId: ballInput.isWicket ? (ballInput.fielderId || null) : null,
        isExtra: ballInput.isExtra,
        extraType: ballInput.isExtra ? ballInput.extraType : null,
        extraRuns: ballInput.isExtra ? ballInput.extraRuns : 0,
        commentary: ballInput.commentary,
        timestamp: new Date().toISOString()
      };

      console.log('Recording ball with payload:', ballData);
      console.log('Batting Team Players:', battingTeamPlayers);
      console.log('Selected Bowler ID:', currentOverBowlerId);
      console.log('Current Innings:', currentInnings);

      const response = await fetch(`https://localhost:5001/api/Match/${matchId}/ball`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(ballData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to record ball: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const newBall = await response.json();
      setBalls([...balls, newBall]);
      console.log('Updated balls state:', [...balls, newBall]);

      // Update innings stats
      currentInnings.runs += newBall.runsScored + newBall.extraRuns;
      if (newBall.isWicket) currentInnings.wickets += 1;
      currentInnings.overs = balls.length / 6 + (balls.length % 6) / 10;

      // Check if innings should end
      if (balls.length + 1 >= maxBallsPerInnings || (newBall.isWicket && currentInnings.wickets + 1 >= maxWickets)) {
        await endInnings();
      }

      setSelectedBallIndex(null);
    } catch (err) {
      setError('Failed to record ball: ' + err.message);
      console.error(err);
    }
  };

  const endInnings = async () => {
    try {
      const response = await fetch(`https://localhost:5001/api/Match/${matchId}/end-innings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ inningsId: currentInnings.inningsId })
      });

      if (!response.ok) throw new Error('Failed to end innings');
      const updatedInnings = await response.json();
      const updatedInningsList = innings.map(i => i.inningsId === updatedInnings.inningsId ? updatedInnings : i);
      setInnings(updatedInningsList);

      if (updatedInningsList.length === 1) {
        // Start second innings
        await startInnings(match.awayTeamId, match.homeTeamId, 2);
        setShowBowlerSelection(true);
      } else {
        // Both innings completed, calculate result
        calculateMatchResult();
      }
    } catch (err) {
      setError('Failed to end innings: ' + err.message);
      console.error(err);
    }
  };

  const calculateMatchResult = async () => {
    const firstInnings = innings[0];
    const secondInnings = innings[1];
    const firstInningsRuns = firstInnings.runs;
    const secondInningsRuns = secondInnings.runs;

    let winnerTeamId = null;
    let winMargin = '';

    if (secondInningsRuns > firstInningsRuns) {
      winnerTeamId = secondInnings.battingTeamId;
      winMargin = `${secondInningsRuns - firstInningsRuns} runs`;
    } else if (secondInningsRuns === firstInningsRuns) {
      // Draw
      winnerTeamId = null;
      winMargin = 'Match Drawn';
    } else {
      winnerTeamId = firstInnings.battingTeamId;
      winMargin = `${firstInningsRuns - secondInningsRuns} runs`;
    }

    try {
      const response = await fetch(`https://localhost:5001/api/Match/${matchId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ winnerTeamId, winMargin })
      });

      if (!response.ok) throw new Error('Failed to end match');
      navigate(`/admin/match-completion/${matchId}`);
    } catch (err) {
      setError('Failed to end match: ' + err.message);
      console.error(err);
    }
  };

  if (!match) return <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>Loading...</div>;

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>{teams.find(t => t.teamId === match.homeTeamId)?.name} vs {teams.find(t => t.teamId === match.awayTeamId)?.name}</h1>
      {error && <p style={{ color: '#B0BEC5', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
      {innings.length > 0 && (
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>First Innings - {teams.find(t => t.teamId === innings[0]?.battingTeamId)?.name}</h2>
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            Score: {innings[0]?.runs}/{innings[0]?.wickets} ({Math.floor(innings[0]?.ballByBallData?.$values?.length / 6)}.{innings[0]?.ballByBallData?.$values?.length % 6} overs)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {Array.from({ length: maxBallsPerInnings }).map((_, index) => {
              const ball = innings[0]?.ballByBallData?.$values?.[index];
              let backgroundColor = '#ccc';
              let content = '';
              let tooltip = '';

              if (ball) {
                if (ball.isWicket) {
                  backgroundColor = '#ff0000'; // Red for wicket
                  content = 'W';
                  tooltip = `Wicket - ${
                    ball.wicketType === 0 ? 'Bowled' :
                    ball.wicketType === 1 ? 'Caught' :
                    ball.wicketType === 2 ? 'LBW' :
                    ball.wicketType === 3 ? 'Run Out' :
                    ball.wicketType === 4 ? 'Stumped' :
                    ball.wicketType === 5 ? 'Stumped Out' :
                    ball.wicketType === 6 ? 'Hit Wicket' :
                    ball.wicketType === 7 ? 'Retired Hurt' :
                    ball.wicketType === 8 ? 'Obstructing Field' :
                    ball.wicketType === 9 ? 'Timed Out' :
                    ball.wicketType === 10 ? 'Handed The Ball Back' :
                    ball.wicketType === 11 ? 'Hit The Ball Twice' : 'Unknown'
                  }`;
                } else if (ball.isExtra) {
                  backgroundColor = '#ffa500'; // Orange for extra
                  content = ball.extraRuns.toString();
                  tooltip = `${
                    ball.extraType === 1 ? 'Wide' :
                    ball.extraType === 2 ? 'No Ball' :
                    ball.extraType === 3 ? 'Bye' :
                    ball.extraType === 4 ? 'Leg Bye' :
                    ball.extraType === 5 ? 'Penalty' : 'Unknown'
                  } - ${ball.extraRuns} run${ball.extraRuns !== 1 ? 's' : ''}`;
                } else {
                  backgroundColor = '#00ff00'; // Green for runs
                  content = ball.runsScored.toString();
                  tooltip = `${ball.runsScored} run${ball.runsScored !== 1 ? 's' : ''}`;
                }
              }

              return (
                <div
                  key={index}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'default',
                    position: 'relative'
                  }}
                  title={tooltip}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {innings.length > 1 && (
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Second Innings - {teams.find(t => t.teamId === innings[1]?.battingTeamId)?.name}</h2>
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            Score: {innings[1]?.runs}/{innings[1]?.wickets} ({Math.floor(innings[1]?.ballByBallData?.$values?.length / 6)}.{innings[1]?.ballByBallData?.$values?.length % 6} overs)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {Array.from({ length: maxBallsPerInnings }).map((_, index) => {
              const ball = innings[1]?.ballByBallData?.$values?.[index];
              let backgroundColor = '#ccc';
              let content = '';
              let tooltip = '';

              if (ball) {
                if (ball.isWicket) {
                  backgroundColor = '#ff0000'; // Red for wicket
                  content = 'W';
                  tooltip = `Wicket - ${
                    ball.wicketType === 0 ? 'Bowled' :
                    ball.wicketType === 1 ? 'Caught' :
                    ball.wicketType === 2 ? 'LBW' :
                    ball.wicketType === 3 ? 'Run Out' :
                    ball.wicketType === 4 ? 'Stumped' :
                    ball.wicketType === 5 ? 'Stumped Out' :
                    ball.wicketType === 6 ? 'Hit Wicket' :
                    ball.wicketType === 7 ? 'Retired Hurt' :
                    ball.wicketType === 8 ? 'Obstructing Field' :
                    ball.wicketType === 9 ? 'Timed Out' :
                    ball.wicketType === 10 ? 'Handed The Ball Back' :
                    ball.wicketType === 11 ? 'Hit The Ball Twice' : 'Unknown'
                  }`;
                } else if (ball.isExtra) {
                  backgroundColor = '#ffa500'; // Orange for extra
                  content = ball.extraRuns.toString();
                  tooltip = `${
                    ball.extraType === 1 ? 'Wide' :
                    ball.extraType === 2 ? 'No Ball' :
                    ball.extraType === 3 ? 'Bye' :
                    ball.extraType === 4 ? 'Leg Bye' :
                    ball.extraType === 5 ? 'Penalty' : 'Unknown'
                  } - ${ball.extraRuns} run${ball.extraRuns !== 1 ? 's' : ''}`;
                } else {
                  backgroundColor = '#00ff00'; // Green for runs
                  content = ball.runsScored.toString();
                  tooltip = `${ball.runsScored} run${ball.runsScored !== 1 ? 's' : ''}`;
                }
              }

              return (
                <div
                  key={index}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'default',
                    position: 'relative'
                  }}
                  title={tooltip}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {currentInnings && !currentInnings.isCompleted && (
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Current Innings - {teams.find(t => t.teamId === currentInnings.battingTeamId)?.name}</h2>
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            Score: {currentInnings.runs}/{currentInnings.wickets} ({Math.floor(balls.length / 6)}.{balls.length % 6} overs)
            {currentOverBowlerId && (
              <span> | Current Bowler: {players.find(p => p.playerId === currentOverBowlerId)?.name}</span>
            )}
          </p>
          {showBowlerSelection && (
            <div style={{ background: '#fff', color: '#000', padding: '20px', borderRadius: '10px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
              <h3>Select Bowler for Over {Math.floor(balls.length / 6) + 1}</h3>
              <select
                value={currentOverBowlerId || ''}
                onChange={e => handleBowlerSelection(parseInt(e.target.value))}
                style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px' }}
              >
                <option value="">Select Bowler</option>
                {players
                  .filter(p => {
                    const isBowlingTeam = p.teamId === currentInnings.bowlingTeamId;
                    const isBowlerOrAllRounder = p.role === 1 || p.role === 2 || p.role === 4; // Bowler = 1, AllRounder = 2, Custom Bowler = 4
                    console.log(`Player: ${p.name}, TeamId: ${p.teamId}, Role: ${p.role}, IsBowlingTeam: ${isBowlingTeam}, IsBowlerOrAllRounder: ${isBowlerOrAllRounder}`);
                    return isBowlingTeam && isBowlerOrAllRounder;
                  })
                  .map(bowler => (
                    <option key={bowler.playerId} value={bowler.playerId}>{bowler.name}</option>
                  ))}
              </select>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {Array.from({ length: maxBallsPerInnings }).map((_, index) => {
              const ball = balls[index];
              let backgroundColor = '#ccc';
              let content = '';
              let tooltip = '';

              if (ball) {
                if (ball.isWicket) {
                  backgroundColor = '#ff0000'; // Red for wicket
                  content = 'W';
                  tooltip = `Wicket - ${
                    ball.wicketType === 0 ? 'Bowled' :
                    ball.wicketType === 1 ? 'Caught' :
                    ball.wicketType === 2 ? 'LBW' :
                    ball.wicketType === 3 ? 'Run Out' :
                    ball.wicketType === 4 ? 'Stumped' :
                    ball.wicketType === 5 ? 'Stumped Out' :
                    ball.wicketType === 6 ? 'Hit Wicket' :
                    ball.wicketType === 7 ? 'Retired Hurt' :
                    ball.wicketType === 8 ? 'Obstructing Field' :
                    ball.wicketType === 9 ? 'Timed Out' :
                    ball.wicketType === 10 ? 'Handed The Ball Back' :
                    ball.wicketType === 11 ? 'Hit The Ball Twice' : 'Unknown'
                  }`;
                } else if (ball.isExtra) {
                  backgroundColor = '#ffa500'; // Orange for extra
                  content = ball.extraRuns.toString();
                  tooltip = `${
                    ball.extraType === 1 ? 'Wide' :
                    ball.extraType === 2 ? 'No Ball' :
                    ball.extraType === 3 ? 'Bye' :
                    ball.extraType === 4 ? 'Leg Bye' :
                    ball.extraType === 5 ? 'Penalty' : 'Unknown'
                  } - ${ball.extraRuns} run${ball.extraRuns !== 1 ? 's' : ''}`;
                } else {
                  backgroundColor = '#00ff00'; // Green for runs
                  content = ball.runsScored.toString();
                  tooltip = `${ball.runsScored} run${ball.runsScored !== 1 ? 's' : ''}`;
                }
              }

              return (
                <div
                  key={index}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: index < balls.length ? 'default' : 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => handleBallClick(index)}
                  title={tooltip}
                >
                  {content}
                </div>
              );
            })}
          </div>
          {selectedBallIndex !== null && (
            <div style={{ background: '#fff', color: '#000', padding: '20px', borderRadius: '10px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
              <h3>Ball {Math.floor(selectedBallIndex / 6) + 1}.{selectedBallIndex % 6 + 1}</h3>
              <div style={{ marginBottom: '10px' }}>
                <label>Runs: </label>
                <select value={ballInput.runs} onChange={e => setBallInput({ ...ballInput, runs: parseInt(e.target.value), isWicket: false, isExtra: false })}>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={ballInput.isWicket}
                    onChange={e => setBallInput({ ...ballInput, isWicket: e.target.checked, runs: 0, isExtra: false })}
                  />
                  Wicket
                </label>
                {ballInput.isWicket && (
                  <select value={ballInput.wicketType} onChange={e => setBallInput({ ...ballInput, wicketType: parseInt(e.target.value) })}>
                    <option value={0}>Bowled</option>
                    <option value={1}>Caught</option>
                    <option value={2}>LBW</option>
                    <option value={3}>Run Out</option>
                    <option value={4}>Stumped</option>
                    <option value={5}>Stumped Out</option>
                    <option value={6}>Hit Wicket</option>
                    <option value={7}>Retired Hurt</option>
                    <option value={8}>Obstructing Field</option>
                    <option value={9}>Timed Out</option>
                    <option value={10}>Handed The Ball Back</option>
                    <option value={11}>Hit The Ball Twice</option>
                  </select>
                )}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={ballInput.isExtra}
                    onChange={e => setBallInput({ ...ballInput, isExtra: e.target.checked, runs: 0, isWicket: false })}
                  />
                  Extra
                </label>
                {ballInput.isExtra && (
                  <>
                    <select value={ballInput.extraType} onChange={e => setBallInput({ ...ballInput, extraType: parseInt(e.target.value) })}>
                      <option value={1}>Wide</option>
                      <option value={2}>No Ball</option>
                      <option value={3}>Bye</option>
                      <option value={4}>Leg Bye</option>
                      <option value={5}>Penalty</option>
                    </select>
                    <input
                      type="number"
                      value={ballInput.extraRuns}
                      onChange={e => setBallInput({ ...ballInput, extraRuns: parseInt(e.target.value) || 0 })}
                      placeholder="Extra Runs"
                      style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px' }}
                    />
                  </>
                )}
              </div>
              <input
                type="text"
                value={ballInput.commentary}
                onChange={e => setBallInput({ ...ballInput, commentary: e.target.value })}
                placeholder="Commentary"
                style={{ width: '100%', padding: '5px', marginBottom: '10px', borderRadius: '5px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleBallInputSubmit} style={{ padding: '10px', background: '#1976D2', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                  Submit
                </button>
                <button onClick={() => setSelectedBallIndex(null)} style={{ padding: '10px', background: '#D32F2F', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scorecard;