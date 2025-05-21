import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);
      setMessage(response.data.message);
      if (onRegister) onRegister();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
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
        <h2 style={{ color: '#FFFFFF', fontSize: '36px', marginBottom: '20px' }}>Register</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            style={{
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: 'none',
              fontSize: '16px',
            }}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
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
            value={formData.password}
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
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            style={{
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: 'none',
              fontSize: '16px',
            }}
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
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
            Register
          </button>
        </form>
        {message && <p style={{ color: '#B0BEC5', marginTop: '10px' }}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;