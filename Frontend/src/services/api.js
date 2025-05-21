
// import axios from 'axios';
// import { useContext } from 'react';
// import { venues } from '../data/venues';
// import { AuthContext } from '../context/AuthContext'; // Adjust path as needed

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
//   },
// });

// export const setAuthToken = (token) => {
//   if (token) {
//     api.defaults.headers.Authorization = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.Authorization;
//   }
// };

// // Hook to update token dynamically (optional, for components)
// export const useAuthToken = () => {
//   const { isAuthenticated, user } = useContext(AuthContext);
//   if (isAuthenticated && user.token) {
//     setAuthToken(user.token);
//   }
//   return api;
// };


// export const getMatches = async () => {
//   const response = await api.get('/api/Match');
//   return response.data;
// };

// export const createMatch = async (matchData) => {
//   const response = await api.post('/api/Match', matchData);
//   return response.data;
// };

// export const getTeams = async () => {
//   const response = await api.get('/api/Teams');
//   return response.data;
// };

// export const createTeam = async (teamData) => {
//   const response = await api.post('/api/Teams', teamData);
//   return response.data;
// };

// export const getPlayers = async () => {
//   const response = await api.get('/api/Player');
//   return response.data;
// };

// export const createPlayer = async (playerData) => {
//   const response = await api.post('/api/Player', playerData);
//   return response.data;
// };

// export const getMatch = async (matchId) => {
//   const response = await api.get(`/api/Match/${matchId}`);
//   return response.data;
// };

// export const updateMatch = async (matchId, matchData) => {
//   const response = await api.put(`/api/Match/${matchId}`, matchData);
//   return response.data;
// };

// export const getUserProfile = async () => {
//   const response = await api.get('/api/User/profile');
//   return response.data;
// };

// export const updateUserProfile = async (userId, profileData) => {
//   const response = await api.put(`/api/User/${userId}`, profileData);
//   return response.data;
// };

// export const getVenues = () => {
//   return Promise.resolve(venues); // Hardcoded venue data
// };

// export const startInnings = async (inningsData) => {
//   const response = await api.post('/api/Score/innings', inningsData);
//   return response.data;
// };

// export const addBall = async (ballData) => {
//   const response = await api.post('/api/Score/ball', ballData);
//   return response.data;
// };

// export const endMatch = async (matchId, winnerData) => {
//   const response = await api.post(`/api/Score/match/end/${matchId}`, null, { params: winnerData });
//   return response.data;
// };
// export default api;
// import axios from 'axios';
// import { venues } from '../data/venues';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5001',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
//   },
// });

// // Function to update the token
// export const setAuthToken = (token) => {
//   if (token) {
//     api.defaults.headers.Authorization = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.Authorization;
//   }
// };

// // Update token on each request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     console.log('Using token:', token); // Debug token
//   } else {
//     console.warn('No token found in localStorage');
//   }
//   return config;
// }, (error) => Promise.reject(error));

// // Intercept responses to handle 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.error('401 Error - Token might be invalid:', error.response.data);
//     }
//     return Promise.reject(error);
//   }
// );

// // API functions
// export const getMatches = async () => {
//   const response = await api.get('/api/Match');
//   return response.data;
// };

// export const createMatch = async (matchData) => {
//   console.log('Sending match data:', matchData); // Debug the sent data
//   console.log('Request headers:', api.defaults.headers); // Debug headers
//   const response = await api.post('/api/Match', matchData);
//   return response.data;
// };

// export const getMatch = async (matchId) => {
//   const response = await api.get(`/api/Match/${matchId}`);
//   return response.data;
// };

// export const updateMatch = async (matchId, matchData) => {
//   const response = await api.put(`/api/Match/${matchId}`, matchData);
//   return response.data;
// };

// export const getTeams = async () => {
//   const response = await api.get('/api/Teams');
//   return response.data;
// };

// export const createTeam = async (teamData) => {
//   const response = await api.post('/api/Teams', teamData);
//   return response.data;
// };

// export const getPlayers = async () => {
//   const response = await api.get('/api/Player');
//   return response.data;
// };

// export const createPlayer = async (playerData) => {
//   const response = await api.post('/api/Player', playerData);
//   return response.data;
// };

// export const getUserProfile = async () => {
//   const response = await api.get('/api/User/profile');
//   return response.data;
// };

// export const updateUserProfile = async (userId, profileData) => {
//   const response = await api.put(`/api/User/${userId}`, profileData);
//   return response.data;
// };

// export const getVenues = () => {
//   return Promise.resolve(venues);
// };

// export const getUmpires = async () => {
//   const response = await api.get('/api/Umpires');
//   return response.data;
// };

// export const startInnings = async (inningsData) => {
//   const response = await api.post('/api/Score/innings', inningsData);
//   return response.data;
// };

// export const addBall = async (ballData) => {
//   const response = await api.post('/api/Score/ball', ballData);
//   return response.data;
// };

// export const getBallsByInnings = async (inningsId) => {
//   const response = await api.get(`/api/BallByBall/innings/${inningsId}`);
//   return response.data;
// };

// export const endMatch = async (matchId, winnerData) => {
//   const response = await api.post(`/api/Score/match/end/${matchId}`, null, { params: winnerData });
//   return response.data;
// };

// // New API functions based on your backend
// export const getSeasons = async () => {
//   const response = await api.get('/api/Season');
//   return response.data;
// };

// export default api;import axios from 'axios';
import { venues } from '../data/venues';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
});

// Function to update the token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.Authorization;
  }
};

// Update token on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Using token:', token); // Debug token
  } else {
    console.warn('No token found in localStorage');
  }
  return config;
}, (error) => Promise.reject(error));

// Intercept responses to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('401 Error - Token might be invalid:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Match API functions
export const getMatches = async () => {
  const response = await api.get('/api/Match');
  return response.data;
};

export const createMatch = async (matchData) => {
  console.log('Sending match data:', matchData);
  console.log('Request headers:', api.defaults.headers);
  const response = await api.post('/api/Match', matchData);
  return response.data;
};

export const getMatch = async (matchId) => {
  const response = await api.get(`/api/Match/${matchId}`);
  return response.data;
};

export const updateMatch = async (matchId, matchData) => {
  const response = await api.put(`/api/Match/${matchId}`, matchData);
  return response.data;
};

// Teams API functions
export const getTeams = async () => {
  const response = await api.get('/api/Teams');
  return response.data;
};

export const createTeam = async (teamData) => {
  const response = await api.post('/api/Teams', teamData);
  return response.data;
};

export const updateTeam = async (id, teamData) => {
  const response = await api.put(`/api/Teams/${id}`, teamData);
  return response.data;
};

export const deleteTeam = async (id) => {
  const response = await api.delete(`/api/Teams/${id}`);
  return response.data;
};

// Player API functions
export const getPlayers = async () => {
  const response = await api.get('/api/Player');
  return response.data;
};

export const createPlayer = async (playerData) => {
  const response = await api.post('/api/Player', playerData);
  return response.data;
};

export const getPlayerById = async (id) => {
  const response = await api.get(`/api/Player/${id}`);
  return response.data;
};

export const updatePlayerById = async (id, playerData) => {
  const response = await api.put(`/api/Player/${id}`, playerData);
  return response.data;
};

export const deletePlayerById = async (id) => {
  const response = await api.delete(`/api/Player/${id}`);
  return response.data;
};

export const getPlayersByTeam = async (teamId) => {
  const response = await api.get(`/api/Player/team/${teamId}`);
  return response.data;
};

export const getPlayersByRole = async (role) => {
  const response = await api.get(`/api/Player/role/${role}`);
  return response.data;
};

// User API functions
export const getUserProfile = async () => {
  const response = await api.get('/api/Auth/profile'); // Correct endpoint
  return response.data;
};

export const updateUserProfile = async (userId, profileData) => {
  const response = await api.put(`/api/User/${userId}`, profileData); // Keep as is unless changed
  return response.data;
};

// Venues API functions
export const getVenues = () => {
  return Promise.resolve(venues);
};

// Umpires API functions
export const getUmpires = async () => {
  const response = await api.get('/api/Umpires');
  return response.data;
};

// Score API functions
export const startInnings = async (inningsData) => {
  const response = await api.post('/api/Score/innings', inningsData);
  return response.data;
};

export const updateInnings = async (inningsData) => {
  const response = await api.put('/api/Score/innings', inningsData);
  return response.data;
};

export const endInnings = async (inningsId) => {
  const response = await api.post(`/api/Score/innings/end/${inningsId}`);
  return response.data;
};

export const addBall = async (ballData) => {
  const response = await api.post('/api/Score/ball', ballData);
  return response.data;
};

export const updateBatting = async (battingData) => {
  const response = await api.put('/api/Score/batting', battingData);
  return response.data;
};

export const updateBowling = async (bowlingData) => {
  const response = await api.put('/api/Score/bowling', bowlingData);
  return response.data;
};

export const endMatch = async (matchId, winnerData) => {
  const response = await api.post(`/api/Score/match/end/${matchId}`, null, { params: winnerData });
  return response.data;
};

// BallByBall API functions
export const getAllBalls = async () => {
  const response = await api.get('/api/BallByBall');
  return response.data;
};

export const createBallByBall = async (ballData) => {
  const response = await api.post('/api/BallByBall', ballData);
  return response.data;
};

export const getBallById = async (id) => {
  const response = await api.get(`/api/BallByBall/${id}`);
  return response.data;
};

export const updateBallById = async (id, ballData) => {
  const response = await api.put(`/api/BallByBall/${id}`, ballData);
  return response.data;
};

export const deleteBallById = async (id) => {
  const response = await api.delete(`/api/BallByBall/${id}`);
  return response.data;
};

export const getBallsByInnings = async (inningsId) => {
  const response = await api.get(`/api/BallByBall/innings/${inningsId}`);
  return response.data;
};

// Season API functions
export const getSeasons = async () => {
  const response = await api.get('/api/Season');
  return response.data;
};

export default api;