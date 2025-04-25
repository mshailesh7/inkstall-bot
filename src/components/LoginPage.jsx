import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
//import logo from '../assets/inkstall.svg';
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

  //  try {
  //     // Make API call to login endpoint
  //     const response = await axios.post('/api/auth/login', {
  //       email,
  //       password
  //     });
      
  //     // Log the full response to see its structure
  //     console.log('Full API Response:', response.data);
      
  //     // Extract JWT token from response - handle different possible structures
  //     let token = null;
      
  //     if (response.data.token) {
  //       // The token might be prefixed with "Bearer "
  //       token = response.data.token.startsWith('Bearer ') 
  //         ? response.data.token.substring(7) // Remove "Bearer " prefix
  //         : response.data.token;
  //     } else if (response.data.accessToken) {
  //       token = response.data.accessToken;
  //     } else if (response.data.jwt) {
  //       token = response.data.jwt;
  //     } else if (typeof response.data === 'string') {
  //       // Some APIs might return the token directly as a string
  //       token = response.data;
  //     }
      
  //     // Check enrollment status directly from response
  //     const isEnrolled = response.data.isEnrolled;
  //     console.log('Enrollment status:', isEnrolled);
      
  //     if (token) {
  //       // Calculate expiration time (7 days from now)
  //       const expirationTime = new Date();
  //       expirationTime.setDate(expirationTime.getDate() + 7); // Add 7 days
        
  //       // Create token object with expiration
  //       const tokenData = {
  //         value: token,
  //         expiry: expirationTime.getTime() // Store as timestamp
  //       };
        
  //       // Store token with expiration in session storage
  //       sessionStorage.setItem('token', JSON.stringify(tokenData));
        
  //       // Store user data
  //       if (response.data.user) {
  //         sessionStorage.setItem('user', JSON.stringify(response.data.user));
  //       }
        
  //       // Store enrollment status in session storage for easy access
  //       sessionStorage.setItem('isEnrolled', JSON.stringify(isEnrolled));
        
  //       // Redirect based on enrollment status
  //       if (isEnrolled === false) {
  //         // User is not enrolled, redirect to enrollment page
  //         console.log('Redirecting to enrollment page...');
  //         navigate('/enrollment');
  //       } else {
          
  //         // User is enrolled, redirect to dashboard
  //         console.log('Redirecting to dashboard...');
  //         navigate('/');
  //       }
  //     } else {
  //       console.error('No token found in response:', response.data);
  //       setError('Login successful but no authentication token received. Please contact support.');
  //     }
      
  //   } catch (err) {
  //     console.error('Login error:', err);
  //   }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-2 sm:px-4 md:px-0 webkit-text-adjust" >
      <div className="border-2 border-[#b7d8fb] bg-gradient-to-br from-[#e3f0ff] to-[#b3d1f8] rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-3xl p-1 sm:p-2 md:p-4 " style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',boxSizing: 'border-box', paddingTop: 'px', borderWidth: '2px', paddingRight: '2px',}} >
        {/* Left side - Form */}
        <div className="w-full md:w-[55%] flex flex-col justify-center p-3 sm:p-4 md:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">Login</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Enter Your Account Credentials</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
                autoComplete="username"
              />
            </div>
            
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
                autoComplete="current-password"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-white text-gray-800 font-medium border border-white rounded-lg px-4 py-2 hover:bg-blue-200 transition-colors inline-flex items-center shadow-sm"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login ›"}
              </button>
              
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate('/forgot')}
              >
                Forgot Password?
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-between w-full gap-2">
  <span className="text-gray-700">Don't have an account?</span>
  <button
    type="button"
    className="bg-blue-100 text-blue-700 font-medium rounded-lg px-6 py-2 hover:bg-blue-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    onClick={() => navigate('/RegistrationPage')}
    disabled={loading}
    >
    Sign Up
  </button>
</div>
          </form>
        </div>
        
        {/* Right side - Illustration (responsive) */}
        <div className="hidden sm:flex w-full md:w-[45%] items-center justify-center p-0 mt-6 md:mt-0 order-2 md:order-2">
          <div className="border-2 border-white rounded-2xl bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center w-full h-[260px] min-h-[260px] max-h-[260px] sm:h-[340px] sm:min-h-[340px] sm:max-h-[340px] md:h-[440px] md:min-h-[440px] md:max-h-[440px] md:w-[310px] md:min-w-[310px] md:max-w-[310px] m-0 relative" >
            {/* Paper ball illustration (centered) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <svg width="90" height="90" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-[130px] md:h-[130px] w-[90px] h-[90px]">
                <circle cx="65" cy="65" r="40" fill="#F6F7F9" stroke="#E0E7EF" strokeWidth="2" />
                {/* Paper ball effect */}
                <ellipse cx="65" cy="65" rx="32" ry="32" fill="#fff" />
                <ellipse cx="65" cy="65" rx="28" ry="28" fill="#f6f7f9" />
              </svg>
              {/* Rays */}
              <svg width="60" height="60" viewBox="0 0 120 120" fill="none" style={{ position: 'absolute', top: 5, left: 5 }} className="md:w-[120px] md:h-[120px] w-[60px] h-[60px]">
                <g stroke="#fff" strokeWidth="5" strokeLinecap="round">
                  <line x1="60" y1="10" x2="60" y2="30" />
                  <line x1="60" y1="90" x2="60" y2="110" />
                  <line x1="10" y1="60" x2="30" y2="60" />
                  <line x1="90" y1="60" x2="110" y2="60" />
                  <line x1="25" y1="25" x2="40" y2="40" />
                  <line x1="95" y1="25" x2="80" y2="40" />
                  <line x1="25" y1="95" x2="40" y2="80" />
                  <line x1="95" y1="95" x2="80" y2="80" />
                </g>
              </svg>
              {/* Sound waves */}
              <svg width="30" height="20" viewBox="0 0 60 40" fill="none" style={{ position: 'absolute', left: '72%', top: '50%', transform: 'translateY(-50%)' }} className="md:w-[60px] md:h-[40px] w-[30px] h-[20px]">
                <path d="M5,20 Q15,10 25,20 Q35,30 45,20 Q55,10 60,20" stroke="#fff" strokeWidth="3" fill="none" />
              </svg>
            </div>
            {/* Curved wire */}
            <svg className="absolute right-0 top-1/3" width="70" height="60" viewBox="0 0 140 120" fill="none">
              <path d="M0,60 Q40,10 70,60 Q100,110 140,60" stroke="#fff" strokeWidth="3" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;