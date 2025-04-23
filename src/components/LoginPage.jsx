import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../assets/inkstall.svg';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Make API call to login endpoint
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      
      // Log the full response to see its structure
      console.log('Full API Response:', response.data);
      
      // Extract JWT token from response - handle different possible structures
      let token = null;
      
      if (response.data.token) {
        // The token might be prefixed with "Bearer "
        token = response.data.token.startsWith('Bearer ') 
          ? response.data.token.substring(7) // Remove "Bearer " prefix
          : response.data.token;
      } else if (response.data.accessToken) {
        token = response.data.accessToken;
      } else if (response.data.jwt) {
        token = response.data.jwt;
      } else if (typeof response.data === 'string') {
        // Some APIs might return the token directly as a string
        token = response.data;
      }
      
      // Check enrollment status directly from response
      const isEnrolled = response.data.isEnrolled;
      console.log('Enrollment status:', isEnrolled);
      
      if (token) {
        // Calculate expiration time (7 days from now)
        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 7); // Add 7 days
        
        // Create token object with expiration
        const tokenData = {
          value: token,
          expiry: expirationTime.getTime() // Store as timestamp
        };
        
        // Store token with expiration in session storage
        sessionStorage.setItem('token', JSON.stringify(tokenData));
        
        // Store user data
        if (response.data.user) {
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Store enrollment status in session storage for easy access
        sessionStorage.setItem('isEnrolled', JSON.stringify(isEnrolled));
        
        // Redirect based on enrollment status
        if (isEnrolled === false) {
          // User is not enrolled, redirect to enrollment page
          console.log('Redirecting to enrollment page...');
          navigate('/enrollment');
        } else {
          
          // User is enrolled, redirect to dashboard
          console.log('Redirecting to dashboard...');
          navigate('/');
        }
      } else {
        console.error('No token found in response:', response.data);
        setError('Login successful but no authentication token received. Please contact support.');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo" style={{ textAlign: 'center' }}>
          <img src={logo} alt="Logo" />
          <div className="subtitle">Education Dashboard</div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group input-with-icon">
            <span className="input-icon">
              <MailOutlineIcon style={{ fontSize: 20, opacity: 0.5 }} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="username"
            />
          </div>
          <div className="input-group input-with-icon">
            <span className="input-icon">
              <LockOutlinedIcon style={{ fontSize: 20, opacity: 0.5 }} />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 12 }}>
            <button
              type="button"
              className="forgot-password-link"
              style={{ background: 'none', border: 'none', color: '#1976d2', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 14 }}
              onClick={() => navigate('/forgot')}
            >
              Forgot Password?
            </button>
          </div>
          <button 
            type="submit" 
            className="sign-in-button" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            disabled={loading}
          >
            <LoginIcon style={{ fontSize: 22, marginRight: 8 }} />
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button
            type="button"
            className="register-button"
            style={{ marginTop: 16, width: '100%', padding: '10px', background: '#eee', border: 'none', borderRadius: 4, cursor: 'pointer', color: '#333', fontWeight: 600 }}
            onClick={() => navigate('/RegistrationPage')}
            disabled={loading}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;