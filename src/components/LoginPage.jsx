import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
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
        <div className="logo">
          <img src="/logo.png" alt="Inkstall" />
          <h2>Education Dashboard</h2>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          
          <button type="submit" className="sign-in-button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <LoginIcon style={{ fontSize: 24 }} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;