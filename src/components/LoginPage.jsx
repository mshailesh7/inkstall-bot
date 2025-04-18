import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../assets/inkstall.svg';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage (for demo)
      localStorage.setItem('user', JSON.stringify({ email }));
      
      // Set flag to show welcome message after login
      localStorage.setItem('showWelcome', 'true');
      
      // Navigate to dashboard
      navigate('/');
      
    } catch (err) {
      setError('Invalid credentials');
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
          <button type="submit" className="sign-in-button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <LoginIcon style={{ fontSize: 22, marginRight: 8 }} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;