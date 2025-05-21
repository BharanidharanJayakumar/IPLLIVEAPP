
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import React, { useState } from 'react';

// const Login = ({ setIsAuthenticated, setUser, setIsAdmin }) => {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('Credentials:', credentials);
//     console.log('API URL:', process.env.REACT_APP_API_URL);

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Auth/login`, credentials, {
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (response.data.token) {
//         const token = response.data.token;
//         const userData = response.data.user;
//         console.log('User data from DB:', userData);
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(userData));
//         setIsAuthenticated(true);
//         setUser(userData);
//         setIsAdmin(!!userData.isAdmin); // Set isAdmin based on response
//         setMessage('Login successful!');
//         navigate(userData.isAdmin ? '/admin-dashboard' : '/user-dashboard');
//       } else {
//         setMessage('No token received from server');
//       }
//     } catch (error) {
//       console.error('Login error:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url,
//       });
//       setMessage('Invalid credentials or server error');
//     }
//   };

//   return (
//     <div
//       style={{
//         background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)',
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         fontFamily: 'Arial, sans-serif',
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: 'rgba(255, 255, 255, 0.1)',
//           padding: '40px',
//           borderRadius: '15px',
//           boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
//           width: '400px',
//           textAlign: 'center',
//         }}
//       >
//         <h2 style={{ color: '#FFFFFF', fontSize: '36px', marginBottom: '20px' }}>Login</h2>
//         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
//           <input
//             type="text"
//             name="username"
//             value={credentials.username}
//             onChange={handleChange}
//             placeholder="Username or Email"
//             style={{
//               padding: '10px',
//               margin: '10px 0',
//               borderRadius: '5px',
//               border: 'none',
//               fontSize: '16px',
//             }}
//           />
//           <input
//             type="password"
//             name="password"
//             value={credentials.password}
//             onChange={handleChange}
//             placeholder="Password"
//             style={{
//               padding: '10px',
//               margin: '10px 0',
//               borderRadius: '5px',
//               border: 'none',
//               fontSize: '16px',
//             }}
//           />
//           <button
//             type="submit"
//             style={{
//               padding: '12px',
//               backgroundColor: '#D32F2F',
//               color: '#FFFFFF',
//               border: 'none',
//               borderRadius: '5px',
//               fontSize: '18px',
//               cursor: 'pointer',
//               transition: 'transform 0.3s',
//             }}
//             onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
//             onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
//           >
//             Login
//           </button>
//         </form>
//         {message && <p style={{ color: '#B0BEC5', marginTop: '10px' }}>{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Login;
import axios from 'axios'; // Keep as is, though unused now
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import api from '../services/api'; // Use default import for api
import { setAuthToken } from '../services/api'; // Import setAuthToken as named export

const Login = ({ setIsAuthenticated, setUser, setIsAdmin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Credentials:', credentials);
    console.log('API URL:', process.env.REACT_APP_API_URL);

    try {
      const response = await api.post('/api/Auth/login', credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.token) {
        const token = response.data.token;
        const userData = response.data.user;
        console.log('User data from DB:', userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuthToken(token); // Set the token in the axios instance
        setIsAuthenticated(true);
        setUser(userData);
        setIsAdmin(!!userData.isAdmin); // Set isAdmin based on response
        setMessage('Login successful!');
        navigate(userData.isAdmin ? '/admin-dashboard' : '/user-dashboard');
      } else {
        setMessage('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
      });
      setMessage('Invalid credentials or server error');
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, #0D47A1, #42A5F5)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
          width: '400px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: '#FFFFFF', fontSize: '36px', marginBottom: '20px' }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Username or Email"
            style={{
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: 'none',
              fontSize: '16px',
            }}
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            style={{
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: 'none',
              fontSize: '16px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px',
              backgroundColor: '#D32F2F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'transform 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
          >
            Login
          </button>
        </form>
        {message && <p style={{ color: '#B0BEC5', marginTop: '10px' }}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;