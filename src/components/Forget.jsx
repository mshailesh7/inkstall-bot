import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../assets/inkstall.svg';

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={logo} alt="Logo" style={{ height: '60px', margin: '0 auto' }} />
          <h2 className="text-2xl font-bold mt-4">Reset Password</h2>
        </div>
        
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
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded px-3 py-2"
              value={formData.email}
              onChange={handleChange}
              disabled={loading || success}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="w-full border rounded px-3 py-2"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={loading || success}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full border rounded px-3 py-2"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading || success}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading || success}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
          
          <p className="mt-4 text-center">
            Remember your password?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Back to Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
