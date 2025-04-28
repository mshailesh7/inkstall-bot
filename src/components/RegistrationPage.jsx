import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../assets/inkstall.svg';
import signup from '../assets/sign.png';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setApiError("");
      
      try {
        // Prepare data for API
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        };
        
        // Make API call to register endpoint
        const response = await axios.post('/api/auth/register', userData);
        
        console.log("Registration successful:", response.data);
        setSuccess(true);
        
        // Store user data if available in the response
        if (response.data.user) {
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Store token if available in the response
        if (response.data.token) {
          // Calculate expiration time (7 days from now)
          const expirationTime = new Date();
          expirationTime.setDate(expirationTime.getDate() + 7);
          
          // Create token object with expiration
          const tokenData = {
            value: response.data.token,
            expiry: expirationTime.getTime() // Store as timestamp
          };
          
          // Store token with expiration in session storage
          sessionStorage.setItem('token', JSON.stringify(tokenData));
        }
        
        // Redirect to enrollment page after short delay
        setTimeout(() => {
          navigate('/enrollment');
        }, 2000);
        
      } catch (err) {
        console.error("Registration error:", err);
        setApiError(err.response?.data?.message || "Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-2 sm:px-4 md:px-0 webkit-text-adjust">
      <div className="border-2 border-[#b7d8fb] bg-gradient-to-br from-[#ffff] to-[#ffff] rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-3xl p-1 sm:p-2 md:p-4" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',boxSizing: 'border-box', paddingTop: '2px', paddingBottom: '2px',borderWidth: '2px', paddingRight: '3px',}}>
        {/* Left side - Form */}
        <div className="w-full md:w-[60%] flex flex-col p-3 sm:p-4 md:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">Sign Up</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Set Up Your Student Profile</p>
          
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {apiError}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Registration successful! Redirecting to enrollment...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full bg-gradient-to-r from-[#DBEAFE] to-[#DBEAFE] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading || success}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full bg-gradient-to-r from-[#DBEAFE] to-[#DBEAFE] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading || success}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full bg-gradient-to-r from-[#DBEAFE] to-[#DBEAFE] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || success}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full bg-gradient-to-r from-[#DBEAFE] to-[#DBEAFE] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading || success}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full bg-gradient-to-r from-[#DBEAFE] to-[#DBEAFE] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading || success}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-100 text-gray-800 font-medium border border-white rounded-lg px-4 py-2 hover:bg-blue-200 transition-colors inline-flex items-center shadow-sm w-full sm:w-auto justify-center"
                disabled={loading || success}
              >
                {loading ? "Registering..." : "Register ›"}
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between w-full gap-2">
              <span className="text-gray-700">Already a user?</span>
              <a href="/login" className="bg-blue-100 text-blue-700 font-medium rounded-lg px-6 py-2 hover:bg-blue-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                Login
              </a>
            </div>
            <button
    type="button"
    onClick={() => window.location.href = "https://accounts.google.com/signin"}
    className="bg-blue-100 text-blue-700 font-medium rounded-lg px-6 py-2 hover:bg-blue-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    disabled={loading}
    >
    Login with Gmail
  </button>
          </form>
        </div>
        
        {/* Right side - Illustration */}
        <div className="hidden sm:flex w-full md:w-[40%] items-center justify-center p-0 sm:p-2 mt-6 md:mt-0 order-2 md:order-none">
          <img src={signup} alt="Registration" className="w-full h-auto"style={{ borderRadius: '6px' }} />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
