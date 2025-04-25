import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../assets/inkstall.svg';

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
      <div className="border-2 border-[#b7d8fb] bg-gradient-to-br from-[#e3f0ff] to-[#b3d1f8] rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-3xl p-1 sm:p-2 md:p-4" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
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
                  className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                  className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                  className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                  className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                className="bg-white text-gray-800 font-medium border border-white rounded-lg px-4 py-2 hover:bg-blue-200 transition-colors inline-flex items-center shadow-sm w-full sm:w-auto justify-center"
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
          </form>
        </div>
        
        {/* Right side - Illustration */}
        <div className="hidden sm:flex w-full md:w-[40%] items-center justify-center p-0 sm:p-2 mt-6 md:mt-0 order-2 md:order-none">
          <div className="border-2 border-white rounded-2xl bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center w-full h-[240px] min-h-[240px] sm:h-[320px] sm:min-h-[320px] md:h-[420px] md:min-h-[420px] m-0 md:m-2 relative">
            {/* Rocket illustration */}
            <svg className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9 2 4 3 4 10C4 14 6 16 8 16C9 16 9 15 9 14C9 13 10 12 12 12C14 12 15 13 15 14C15 15 15 16 16 16C18 16 20 14 20 10C20 3 15 2 12 2Z" fill="white"/>
              <path d="M12 17C10.4 17 9 18 9 19C9 20 10 21 12 21C14 21 15 20 15 19C15 18 13.6 17 12 17Z" fill="white"/>
              <path d="M12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 9 12 9C10.9 9 10 8.1 10 7C10 5.9 10.9 5 12 5Z" fill="#3B82F6"/>
            </svg>
            
            {/* Paper balls - responsive sizes */}
            <div className="absolute bottom-8 left-8 w-6 h-6 sm:bottom-10 sm:left-10 sm:w-8 sm:h-8 md:bottom-12 md:left-12 md:w-10 md:h-10 rounded-full bg-white"></div>
            <div className="absolute bottom-16 left-16 w-5 h-5 sm:bottom-20 sm:left-20 sm:w-6 sm:h-6 md:bottom-24 md:left-24 md:w-8 md:h-8 rounded-full bg-white"></div>
            <div className="absolute bottom-12 right-10 w-7 h-7 sm:bottom-16 sm:right-14 sm:w-10 sm:h-10 md:bottom-20 md:right-16 md:w-12 md:h-12 rounded-full bg-white"></div>
            <div className="absolute top-12 right-8 w-5 h-5 sm:top-16 sm:right-10 sm:w-7 sm:h-7 md:top-24 md:right-12 md:w-9 md:h-9 rounded-full bg-white"></div>
            <div className="absolute bottom-20 left-10 w-4 h-4 sm:bottom-24 sm:left-12 sm:w-5 sm:h-5 md:bottom-32 md:left-16 md:w-7 md:h-7 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-20 w-6 h-6 sm:bottom-12 sm:right-24 sm:w-8 sm:h-8 md:bottom-16 md:right-32 md:w-10 md:h-10 rounded-full bg-white"></div>
            <div className="absolute top-20 left-12 w-5 h-5 sm:top-24 sm:left-16 sm:w-6 sm:h-6 md:top-32 md:left-20 md:w-8 md:h-8 rounded-full bg-white"></div>
            
            {/* Dotted flight paths */}
            <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 400 400" fill="none">
              <path d="M100,100 Q150,150 200,120 T300,200" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M150,200 Q200,150 250,180 T350,100" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M120,250 Q170,200 220,230 T320,150" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
