// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Home from './components/Home';
// import Login from './components/Login';
// import Register from './components/Register';
// import AdminDashboard from './components/admin/AdminDashboard';
// import MatchManagement from './components/admin/MatchManagement';
// import TeamManagement from './components/admin/TeamManagement';
// import PlayerManagement from './components/admin/PlayerManagement';
// import LiveScoring from './components/admin/LiveScoring';
// import TossManagement from './components/admin/TossManagement';
// import Scorecard from './components/admin/Scorecard';
// import MatchCompletion from './components/admin/MatchCompletion';
// import ReportsAnalytics from './components/admin/ReportsAnalytics';
// import UserDashboard from './components/user/UserDashboard';
// import MatchHistory from './components/user/MatchHistory';
// import PlayerStats from './components/user/PlayerStats';
// import UserProfile from './components/user/UserProfile';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
//   const [isAdmin, setIsAdmin] = useState(!!(user && user.isAdmin));

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//     setIsAuthenticated(!!token);
//     setUser(storedUser);
//     setIsAdmin(!!(storedUser && storedUser.isAdmin)); // Ensure isAdmin is set correctly
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} setIsAdmin={setIsAdmin} />} />
//         <Route path="/register" element={<Register />} />
//         {isAuthenticated ? (
//           <>
//             {isAdmin ? (
//               <>
//                 <Route path="/admin-dashboard" element={<AdminDashboard />} />
//                 <Route path="/admin/match-management" element={<MatchManagement />} />
//                 <Route path="/admin/team-management" element={<TeamManagement />} />
//                 <Route path="/admin/player-management" element={<PlayerManagement />} />
//                 <Route path="/admin/live-scoring/:matchId" element={<LiveScoring />} />
//                 <Route path="/admin/toss-management/:matchId" element={<TossManagement />} />
//                 <Route path="/admin/scorecard/:matchId" element={<Scorecard />} />
//                 <Route path="/admin/match-completion/:matchId" element={<MatchCompletion />} />
//                 <Route path="/admin/reports-analytics" element={<ReportsAnalytics />} />
//                 <Route path="*" element={<Navigate to="/admin-dashboard" />} />
//               </>
//             ) : (
//               <>
//                 <Route path="/user-dashboard" element={<UserDashboard />} />
//                 <Route path="/user/match-history" element={<MatchHistory />} />
//                 <Route path="/user/player-stats" element={<PlayerStats />} />
//                 <Route path="/user/profile" element={<UserProfile />} />
//                 <Route path="*" element={<Navigate to="/user-dashboard" />} />
//               </>
//             )}
//           </>
//         ) : (
//           <Route path="*" element={<Navigate to="/login" />} />
//         )}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Home from './components/Home';
// import Login from './components/Login';
// import Register from './components/Register';
// import AdminDashboard from './components/admin/AdminDashboard';
// import MatchManagement from './components/admin/MatchManagement';
// import TeamManagement from './components/admin/TeamManagement';
// import PlayerManagement from './components/admin/PlayerManagement';
// import LiveScoring from './components/admin/LiveScoring';
// import TossManagement from './components/admin/TossManagement';
// import Scorecard from './components/admin/Scorecard';
// import MatchCompletion from './components/admin/MatchCompletion';
// import ReportsAnalytics from './components/admin/ReportsAnalytics';
// import UserDashboard from './components/user/UserDashboard';
// import MatchHistory from './components/user/MachHistory';
// import PlayerStats from './components/user/PlayerStats';
// import UserProfile from './components/user/UserProfile';
// import MatchCreate from './components/admin/MatchCreate'; // New route
// import PreviousMatches from './components/admin/PreviousMatches'; // New route

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
//   const [isAdmin, setIsAdmin] = useState(!!(user && user.isAdmin));

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//     setIsAuthenticated(!!token);
//     setUser(storedUser);
//     setIsAdmin(!!(storedUser && storedUser.isAdmin)); // Ensure isAdmin is set correctly
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} setIsAdmin={setIsAdmin} />} />
//         <Route path="/register" element={<Register />} />
//         {isAuthenticated ? (
//           <>
//             {isAdmin ? (
//               <>
//                 <Route path="/admin-dashboard" element={<AdminDashboard />} />
//                 <Route path="/admin/match-management" element={<MatchManagement />} />
//                 <Route path="/admin/match-create" element={<MatchCreate />} /> {/* New route */}
//                 <Route path="/admin/match-management/previous" element={<PreviousMatches />} /> {/* New route */}
//                 <Route path="/admin/team-management" element={<TeamManagement />} />
//                 <Route path="/admin/player-management" element={<PlayerManagement />} />
//                 <Route path="/admin/live-scoring/:matchId" element={<LiveScoring />} />
//                 <Route path="/admin/toss-management/:matchId" element={<TossManagement />} />
//                 <Route path="/admin/scorecard/:matchId" element={<Scorecard />} />
//                 <Route path="/admin/match-completion/:matchId" element={<MatchCompletion />} />
//                 <Route path="/admin/reports-analytics" element={<ReportsAnalytics />} />
//                 <Route path="*" element={<Navigate to="/admin-dashboard" />} />
//               </>
//             ) : (
//               <>
//                 <Route path="/user-dashboard" element={<UserDashboard />} />
//                 <Route path="/user/match-history" element={<MatchHistory />} />
//                 <Route path="/user/player-stats" element={<PlayerStats />} />
//                 <Route path="/user/profile" element={<UserProfile />} />
//                 <Route path="*" element={<Navigate to="/user-dashboard" />} />
//               </>
//             )}
//           </>
//         ) : (
//           <Route path="*" element={<Navigate to="/login" />} />
//         )}
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import MatchManagement from './components/admin/MatchManagement';
import TeamManagement from './components/admin/TeamManagement';
import TeamDetails from './components/admin/TeamDetails'; // Added import for TeamDetails
import PlayerManagement from './components/admin/PlayerManagement';
import LiveScoring from './components/admin/LiveScoring';
import TossManagement from './components/admin/TossManagement';
import Scorecard from './components/admin/Scorecard';
import MatchCompletion from './components/admin/MatchCompletion';
import ReportsAnalytics from './components/admin/ReportsAnalytics';
import UserDashboard from './components/user/UserDashboard';
import MatchHistory from './components/user/MatchHistory';
import PlayerStats from './components/user/PlayerStats';
import UserProfile from './components/user/UserProfile';
import MatchCreate from './components/admin/MatchCreate';
import PreviousMatches from './components/admin/PreviousMatches';
import PointsTable from './components/user/PointsTable';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isAdmin, setIsAdmin] = useState(!!(user && user.isAdmin));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAuthenticated(!!token);
    setUser(storedUser);
    setIsAdmin(!!(storedUser && storedUser.isAdmin));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} setIsAdmin={setIsAdmin} />} />
        <Route path="/register" element={<Register />} />
        {isAuthenticated ? (
          <>
            {isAdmin ? (
              <>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/match-management" element={<MatchManagement />} />
                <Route path="/admin/match-create" element={<MatchCreate />} />
                <Route path="/admin/match-management/previous" element={<PreviousMatches />} />
                <Route path="/admin/team-management" element={<TeamManagement />} />
                <Route path="/admin/team-details/:teamId" element={<TeamDetails />} /> {/* Added route for TeamDetails */}
                <Route path="/admin/player-management" element={<PlayerManagement />} />
                <Route path="/admin/live-scoring/:matchId" element={<LiveScoring />} />
                <Route path="/admin/toss-management/:matchId" element={<TossManagement />} />
                <Route path="/admin/scorecard/:matchId" element={<Scorecard />} />
                <Route path="/admin/match-completion/:matchId" element={<MatchCompletion />} />
                <Route path="/admin/reports-analytics" element={<ReportsAnalytics />} />
                <Route path="*" element={<Navigate to="/admin-dashboard" />} />
              </>
            ) : (
              <>
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/user/match-history" element={<MatchHistory />} />
                <Route path="/user/player-stats" element={<PlayerStats />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/user/live-scores" element={<UserDashboard />} />
                <Route path="/user/points-table" element={<PointsTable />} />
                <Route path="*" element={<Navigate to="/user-dashboard" />} />
              </>
            )}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;