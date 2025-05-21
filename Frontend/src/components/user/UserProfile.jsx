
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getUserProfile, setAuthToken } from '../../services/api';

// const UserProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         navigate('/login');
//         return;
//       }
//       setAuthToken(token); // Ensure the token is set in the axios instance
//       const res = await getUserProfile(); // Uses /api/Auth/profile
//       // Handle the response as a single object
//       const userData = res.data || {};
//       // Only throw error if no essential data is present
//       if (!userData.username && Object.keys(userData).length === 0) {
//         throw new Error('No user data received');
//       }
//       setProfile(userData);
//       setError(''); // Clear error if data is valid
//       console.log('API Response:', res.data); // Debug the response
//     } catch (err) {
//       if (err.response && err.response.status === 401) {
//         setError('Authentication failed. Please log in again.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//       } else {
//         setError(`Failed to fetch profile: ${err.message}`);
//       }
//       console.error('Profile fetch error:', err);
//       // Fallback to stored user data from login if available
//       const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//       if (storedUser.username) {
//         setProfile(storedUser);
//         setError(''); // Clear error if fallback data is used
//       }
//     }
//   };

//   if (!profile) return (
//     <div style={{
//       background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)',
//       minHeight: '100vh',
//       padding: '20px',
//       color: '#fff',
//       fontFamily: 'Arial, sans-serif',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       textAlign: 'center',
//     }}>
//       <p style={{ fontSize: '18px', color: '#B0BEC5' }}>Loading profile...</p>
//     </div>
//   );

//   return (
//     <div style={{
//       background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)',
//       minHeight: '100vh',
//       padding: '20px',
//       color: '#fff',
//       fontFamily: 'Arial, sans-serif',
//       position: 'relative',
//     }}>
//       <button
//         onClick={() => navigate('/user-dashboard')}
//         style={{
//           position: 'absolute',
//           top: '20px',
//           left: '20px',
//           padding: '10px 20px',
//           background: '#D32F2F',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '5px',
//           fontSize: '16px',
//           cursor: 'pointer',
//           transition: 'transform 0.3s',
//         }}
//         onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
//         onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
//       >
//         Back to Dashboard
//       </button>
//       <h1 style={{
//         textAlign: 'center',
//         fontSize: '36px',
//         marginBottom: '30px',
//         textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)',
//         padding: '10px',
//         background: 'rgba(21, 101, 192, 0.7)',
//         borderRadius: '10px',
//         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
//       }}>User Profile</h1>
//       {error && profile && (
//         <p style={{
//           color: '#FF4444',
//           textAlign: 'center',
//           marginBottom: '20px',
//           padding: '10px',
//           background: 'rgba(255, 68, 68, 0.1)',
//           borderRadius: '5px',
//           boxShadow: '0 2px 6px rgba(255, 0, 0, 0.2)',
//         }}>{error}</p>
//       )}
//       <div style={{
//         maxWidth: '600px',
//         margin: '0 auto',
//         background: '#1565C0',
//         padding: '30px',
//         borderRadius: '15px',
//         boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
//         border: '2px solid #1976D2',
//         transition: 'transform 0.3s, box-shadow 0.3s',
//         position: 'relative',
//       }} onMouseOver={e => {
//         e.currentTarget.style.transform = 'scale(1.02)';
//         e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
//       }} onMouseOut={e => {
//         e.currentTarget.style.transform = 'scale(1)';
//         e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
//       }}>
//         <div style={{
//           display: 'grid',
//           gap: '15px',
//           textAlign: 'left',
//           padding: '10px',
//           background: 'rgba(255, 255, 255, 0.05)',
//           borderRadius: '10px',
//         }}>
//           <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#BBDEFB' }}>
//             <span style={{ color: '#fff' }}>Username:</span> {profile.username || 'N/A'}
//           </p>
//           <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#BBDEFB' }}>
//             <span style={{ color: '#fff' }}>Email:</span> {profile.email || 'N/A'}
//           </p>
//           <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#BBDEFB' }}>
//             <span style={{ color: '#fff' }}>First Name:</span> {profile.firstName || 'N/A'}
//           </p>
//           <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#BBDEFB' }}>
//             <span style={{ color: '#fff' }}>Last Name:</span> {profile.lastName || 'N/A'}
//           </p>
//           <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#BBDEFB' }}>
//             <span style={{ color: '#fff' }}>Created At:</span> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
//           </p>
//           <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#BBDEFB' }}>
//             <span style={{ color: '#fff' }}>Last Login:</span> {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'N/A'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, setAuthToken } from '../../services/api';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        navigate('/login');
        return;
      }
      setAuthToken(token);
      const res = await getUserProfile();
      const userData = res.data || {};
      if (!userData.username && Object.keys(userData).length === 0) {
        throw new Error('No user data received');
      }
      setProfile(userData);
      setError('');
      console.log('API Response:', res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError(`Failed to fetch profile: ${err.message}`);
      }
      console.error('Profile fetch error:', err);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.username) {
        setProfile(storedUser);
        setError('');
      }
    }
  };

  if (!profile) return (
    <div style={{
      background: 'linear-gradient(to bottom, #0D47A1, #3A3F5C)',
      minHeight: '100vh',
      padding: '20px',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '18px', color: '#A0AEC0' }}>Loading profile...</p>
    </div>
  );

  return (
    <div style={{
      background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)',
      minHeight: '100vh',
      padding: '20px',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header with Back Button and Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 25px',
        background: 'rgba(13, 71, 161, 0.9)',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
        marginBottom: '30px',
        position: 'relative',
        zIndex: 1,
      }}>
        <button
          onClick={() => navigate('/user-dashboard')}
          style={{
            padding: '10px 20px',
            background: '#1976D2',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'transform 0.3s, box-shadow 0.3s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(25, 118, 210, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
          }}
        >
          Back to Dashboard
        </button>
        <h1 style={{
          fontSize: '36px',
          margin: '0',
          color: '#FFFFFF',
          textShadow: '2px 2px 6px rgba(0, 0, 0, 0.6)',
        }}>User Profile</h1>
        <div style={{ width: '100px' }} /> {/* Spacer for symmetry */}
      </div>

      {error && profile && (
        <p style={{
          color: '#FF6B6B',
          textAlign: 'center',
          marginBottom: '20px',
          padding: '10px',
          background: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(255, 0, 0, 0.2)',
        }}>{error}</p>
      )}

      {/* Blue-themed Background Effects */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '-60px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, #42A5F5, #0D47A1)',
          borderRadius: '50%',
          transform: 'translate(0, 0)',
          transition: 'transform 4s ease-in-out',
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          right: '-60px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, #1976D2, #42A5F5)',
          borderRadius: '50%',
          transform: 'translate(0, 0)',
          transition: 'transform 5s ease-in-out',
          opacity: 0.5,
        }} />
      </div>

      {/* Single Graphical Box with Hover Effects for Rows */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #1E2A44, #2E3A5C)',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(25, 118, 210, 0.3)',
        border: '2px solid #1976D2',
        transition: 'transform 0.3s, box-shadow 0.3s',
        position: 'relative',
        zIndex: 1,
      }} onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(25, 118, 210, 0.5)';
        e.currentTarget.querySelectorAll('div').forEach(div => div.style.transform = 'translate(5px, 5px)');
      }} onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(25, 118, 210, 0.3)';
        e.currentTarget.querySelectorAll('div').forEach(div => div.style.transform = 'translate(0, 0)');
      }}>
        <div style={{
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '15px',
          transition: 'transform 0.3s, background 0.3s',
        }} onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateX(10px) scale(1.02)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }} onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateX(0) scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}>
          <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            <span style={{ color: '#1976D2' }}>Username:</span> {profile.username || 'N/A'}
          </p>
        </div>
        <div style={{
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '15px',
          transition: 'transform 0.3s, background 0.3s',
        }} onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateX(10px) scale(1.02)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }} onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateX(0) scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}>
          <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            <span style={{ color: '#1976D2' }}>Email:</span> {profile.email || 'N/A'}
          </p>
        </div>
        <div style={{
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '15px',
          transition: 'transform 0.3s, background 0.3s',
        }} onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateX(10px) scale(1.02)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }} onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateX(0) scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}>
          <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            <span style={{ color: '#1976D2' }}>First Name:</span> {profile.firstName || 'N/A'}
          </p>
        </div>
        <div style={{
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '15px',
          transition: 'transform 0.3s, background 0.3s',
        }} onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateX(10px) scale(1.02)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }} onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateX(0) scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}>
          <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            <span style={{ color: '#1976D2' }}>Last Name:</span> {profile.lastName || 'N/A'}
          </p>
        </div>
        <div style={{
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '15px',
          transition: 'transform 0.3s, background 0.3s',
        }} onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateX(10px) scale(1.02)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }} onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateX(0) scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}>
          <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            <span style={{ color: '#1976D2' }}>Created At:</span> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div style={{
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          transition: 'transform 0.3s, background 0.3s',
        }} onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateX(10px) scale(1.02)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }} onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateX(0) scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}>
          <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#E0E7FF' }}>
            <span style={{ color: '#1976D2' }}>Last Login:</span> {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;