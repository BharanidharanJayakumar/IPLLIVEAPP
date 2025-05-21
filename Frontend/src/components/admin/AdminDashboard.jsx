// // import React, { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import api from '../../services/api';

// // const AdminDashboard = () => {
// //   const [matches, setMatches] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchMatches = async () => {
// //       try {
// //         const response = await api.get('/match');
// //         setMatches(response.data);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching matches:', error);
// //       }
// //     };
// //     fetchMatches();
// //   }, []);

// //   if (loading) return <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>;

// //   return (
// //     <div style={{
// //       background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)',
// //       minHeight: '100vh',
// //       padding: '20px',
// //       color: '#fff',
// //       fontFamily: 'Arial, sans-serif',
// //     }}>
// //       <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Admin Dashboard</h1>
// //       <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
// //         <Link to="/admin/match-create" style={{
// //           textDecoration: 'none',
// //           backgroundColor: '#D32F2F',
// //           color: '#fff',
// //           padding: '15px 30px',
// //           borderRadius: '10px',
// //           fontSize: '18px',
// //           margin: '10px',
// //           transition: 'transform 0.3s',
// //         }}
// //         onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
// //         onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
// //           Create Match
// //         </Link>
// //         <Link to="/admin/squad-selection" style={{
// //           textDecoration: 'none',
// //           backgroundColor: '#D32F2F',
// //           color: '#fff',
// //           padding: '15px 30px',
// //           borderRadius: '10px',
// //           fontSize: '18px',
// //           margin: '10px',
// //           transition: 'transform 0.3s',
// //         }}
// //         onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
// //         onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
// //           Manage Squads
// //         </Link>
// //         <Link to="/admin/toss-management" style={{
// //           textDecoration: 'none',
// //           backgroundColor: '#D32F2F',
// //           color: '#fff',
// //           padding: '15px 30px',
// //           borderRadius: '10px',
// //           fontSize: '18px',
// //           margin: '10px',
// //           transition: 'transform 0.3s',
// //         }}
// //         onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
// //         onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
// //           Toss Management
// //         </Link>
// //         <Link to="/admin/scorecard" style={{
// //           textDecoration: 'none',
// //           backgroundColor: '#D32F2F',
// //           color: '#fff',
// //           padding: '15px 30px',
// //           borderRadius: '10px',
// //           fontSize: '18px',
// //           margin: '10px',
// //           transition: 'transform 0.3s',
// //         }}
// //         onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
// //         onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
// //           Live Scorecard
// //         </Link>
// //         <Link to="/admin/match-completion" style={{
// //           textDecoration: 'none',
// //           backgroundColor: '#D32F2F',
// //           color: '#fff',
// //           padding: '15px 30px',
// //           borderRadius: '10px',
// //           fontSize: '18px',
// //           margin: '10px',
// //           transition: 'transform 0.3s',
// //         }}
// //         onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
// //         onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
// //           Match Completion
// //         </Link>
// //       </div>
// //       <div style={{ marginTop: '20px' }}>
// //         <h2>Active Matches</h2>
// //         <ul style={{ listStyle: 'none', padding: 0 }}>
// //           {matches.map((match) => (
// //             <li key={match.MatchId} style={{ margin: '10px 0', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px' }}>
// //               {match.HomeTeamName} vs {match.AwayTeamName} - {match.Status} ({new Date(match.ScheduledDateTime).toLocaleString()})
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard - IPLLive</h1>
//       <nav>
//         <ul>
//           <li><Link to="/admin/match-management">Match Management</Link></li>
//           <li><Link to="/admin/team-management">Team Management</Link></li>
//           <li><Link to="/admin/player-management">Player Management</Link></li>
//           <li><Link to="/admin/reports-analytics">Reports & Analytics</Link></li>
//         </ul>
//       </nav>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };

// export default AdminDashboard;import React from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        color: '#FFFFFF',
        padding: '20px',
        overflowX: 'hidden',
      }}
    >
      {/* Header Container */}
      <div
        style={{
          backgroundColor: '#0D47A1',
          width: '100%',
          textAlign: 'center',
          padding: '20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          borderRadius: '0 0 15px 15px',
        }}
      >
        <h1 style={{ fontSize: '36px', margin: '0', textTransform: 'uppercase' }}>Admin Dashboard - IPLLive 2025</h1>
      </div>

      {/* Navigation Container */}
      <div
        style={{
          marginTop: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '40px', // Increased gap for better spacing
          padding: '20px',
          maxWidth: '1400px', // Limit width to avoid excessive stretching
        }}
      >
        {/* Match Management Container */}
        <div
          style={{
            background: 'url(https://th.bing.com/th/id/OIP.Lc01TioGMJthzeByDJcmEQHaEK?w=328&h=184&c=7&r=0&o=5&dpr=1.5&pid=1.7) no-repeat center/cover',
            width: '300px',
            height: '300px', // Increased height to 300px
            borderRadius: '15px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            position: 'relative',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
          }}
        >
          <Link
            to="/admin/match-management"
            style={{
              textDecoration: 'none',
              color: '#FFFFFF',
              display: 'block',
              width: '100',
              height: '100%',
              textAlign: 'center',
              paddingTop: '200px', // Adjusted for new height
              fontSize: '24px',
              background: 'rgba(0, 0, 0, 0.6)',
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)')}
          >
            Manage Matches
          </Link>
        </div>

        {/* Team Management Container */}
        <div
          style={{
            background: 'url(https://th.bing.com/th/id/OIP.c-PxS2TKP3_K37BaSPCJ4AHaEK?w=296&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7) no-repeat center/cover',
            width: '300px',
            height: '300px', // Increased height to 300px
            borderRadius: '15px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            position: 'relative',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
          }}
        >
          <Link
            to="/admin/team-management"
            style={{
              textDecoration: 'none',
              color: '#FFFFFF',
              display: 'block',
              width: '100',
              height: '100%',
              textAlign: 'center',
              paddingTop: '200px', // Adjusted for new height
              fontSize: '24px',
              background: 'rgba(0, 0, 0, 0.6)',
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)')}
          >
            Manage Teams
          </Link>
        </div>

        {/* Player Management Container */}
        <div
          style={{
            background: 'url(https://th.bing.com/th/id/OIP.nA7eZQ0NJKVoNwxPkO0dDQHaEL?w=1420&h=800&rs=1&pid=ImgDetMain) no-repeat center/cover',
            width: '300px',
            height: '300px', // Increased height to 300px
            borderRadius: '15px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            position: 'relative',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
          }}
        >
          <Link
            to="/admin/player-management"
            style={{
              textDecoration: 'none',
              color: '#FFFFFF',
              display: 'block',
              width: '100',
              height: '100%',
              textAlign: 'center',
              paddingTop: '200px', // Adjusted for new height
              fontSize: '24px',
              background: 'rgba(0, 0, 0, 0.6)',
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)')}
          >
            Manage Players
          </Link>
        </div>

        {/* Reports & Analytics Container */}
        <div
          style={{
            background: 'url(https://th.bing.com/th/id/OIP.Jg8PP0TZqOcpfj4MfRkMzwHaE7?rs=1&pid=ImgDetMain) no-repeat center/cover',
            width: '300px',
            height: '300px', // Increased height to 300px
            borderRadius: '15px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            position: 'relative',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
          }}
        >
          <Link
            to="/admin/reports-analytics"
            style={{
              textDecoration: 'none',
              color: '#FFFFFF',
              display: 'block',
              width: '100',
              height: '100%',
              textAlign: 'center',
              paddingTop: '200px', // Adjusted for new height
              fontSize: '24px',
              background: 'rgba(0, 0, 0, 0.6)',
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)')}
          >
            Reports & Analytics
          </Link>
        </div>
      </div>

      {/* Description Containers */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '40px',
          padding: '20px',
          maxWidth: '1400px',
        }}
      >
        {/* Match Management Description */}
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '15px',
            color: '#FFFFFF',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Manage IPL 2025 match schedules, venues, and live scoring. Witness Mumbai Indians vs. Chennai Super Kings!
        </div>

        {/* Team Management Description */}
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '15px',
            color: '#FFFFFF',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Oversee Royal Challengers Bangalore and Kolkata Knight Riders. Update rosters and strategies!
        </div>

        {/* Player Management Description */}
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '15px',
            color: '#FFFFFF',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Manage Virat Kohli and MS Dhoni. Track stats and auction details for IPL 2025!
        </div>

        {/* Reports & Analytics Description */}
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '15px',
            color: '#FFFFFF',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Analyze IPL 2025 metrics. Dive into 2024’s epic finals data!
        </div>
      </div>

      {/* Static Team Containers */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '40px',
          padding: '20px',
          maxWidth: '1400px',
        }}
      >
        {/* Mumbai Indians */}
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '15px',
            color: '#FFFFFF',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Mumbai Indians: 5-time IPL champions (2013, 2015, 2017, 2019, 2021). Star: Rohit Sharma, known for his explosive batting!
        </div>

        {/* Chennai Super Kings */}
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '15px',
            color: '#FFFFFF',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Chennai Super Kings: 4-time champions (2010, 2011, 2018, 2021). Legend: MS Dhoni, the cool-headed finisher!
        </div>

        {/* Royal Challengers Bangalore */}
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '15px',
            color: '#FFFFFF',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Royal Challengers Bangalore: 0 titles, but 3 finals. Star: Virat Kohli, the run-machine of IPL!
        </div>

        {/* Kolkata Knight Riders */}
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '15px',
            color: '#FFFFFF',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Kolkata Knight Riders: 2-time champions (2012, 2014). Star: Andre Russell, the power-hitting all-rounder!
        </div>

        {/* Delhi Capitals */}
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '15px',
            color: '#FFFFFF',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Delhi Capitals: 0 titles, 1 final (2020). Star: Rishabh Pant, the dynamic wicketkeeper-batsman!
        </div>

        {/* Sunrisers Hyderabad */}
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '15px',
            color: '#FFFFFF',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Sunrisers Hyderabad: 1-time champion (2016). Star: Pat Cummins, the pace spearhead for 2025!
        </div>
      </div>

      {/* Logout Button Container */}
      <div
        style={{
          marginTop: '40px',
          textAlign: 'center',
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            padding: '15px 30px',
            backgroundColor: '#D32F2F',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(211, 47, 47, 0.5)',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#B71C1C';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#D32F2F';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;