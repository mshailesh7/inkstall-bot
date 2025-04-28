import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import logo from '../assets/inkstall.svg';
import forget from '../assets/forget.png';

const ForgetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
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
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.newPassword || formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (formData.newPassword !== formData.confirmPassword) {
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
        const resetData = {
          email: formData.email,
          newPassword: formData.newPassword
        };
        
        // Make API call to forgot-password endpoint
        const response = await axios.post('/api/auth/forgot-password', resetData);
        
        console.log("Password reset successful:", response.data);
        setSuccess(true);
        
        // Redirect to login after short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        
      } catch (err) {
        console.error("Password reset error:", err);
        setApiError(err.response?.data?.message || "Password reset failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-2 sm:px-4 md:px-0 webkit-text-adjust" >
      <div className=" border-2 border-[#b7d8fb] bg-gradient-to-br from-[#ffff] to-[#ffff] rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-3xl p-2 md:p-4" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',boxSizing: 'border-box', paddingTop: '2px', paddingBottom: '2px',borderWidth: '2px', paddingRight: '2px',}}>
        {/* Left side - Form */}
        <div className="w-full md:w-[55%] flex flex-col justify-center p-3 sm:p-4 md:p-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">Reset Password</h2>
          <p className="text-gray-600 mb-4 sm:mb-8 text-sm sm:text-base">Set up your new password</p>
          
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {apiError}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Password reset successful! Redirecting to login...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                className="w-full bg-gradient-to-r from-[#DBEAFE] to-[#DBEAFE] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || success}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="w-full bg-gradient-to-r from-[#DBEAFE] to-[#DBEAFE] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading || success}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
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

            <div className="pt-2">
              <button
                type="submit"
                className="bg-blue-100 text-gray-800 font-medium border border-white rounded-lg px-4 py-2 hover:bg-blue-200 transition-colors inline-flex items-center shadow-sm"
                disabled={loading || success}
              >
                {loading ? "Resetting Password..." : "Reset Password"} <span className="ml-1">›</span>
              </button>
            </div>

            <p className="mt-4 text-left pl-1">
  <span className="flex flex-col sm:flex-row items-start sm:items-center">
    Remember your password?
    <a href="/login" className="text-blue-600 hover:underline sm:ml-4 mt-1 sm:mt-0">
      Back to Login
    </a>
  </span>
</p>
          </form>
        </div>
        
        {/* Right side - Illustration */}
        <div className="hidden sm:flex w-full md:w-[45%] items-center justify-center p-0 sm:p-2 mt-4 md:mt-0 order-2 md:order-none ">
          <img src={forget} alt="Forget Password" className="w-full h-auto"style={{ borderRadius: '6px' }} />
        </div>
        </div>
      </div>
    
  );
};

export default ForgetPasswordPage;
