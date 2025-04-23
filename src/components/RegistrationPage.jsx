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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={logo} alt="Logo" style={{ height: '60px', margin: '0 auto' }} />
          <h2 className="text-2xl font-bold mt-4">Create an Account</h2>
        </div>
        
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
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              className="w-full border rounded px-3 py-2"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading || success}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="w-full border rounded px-3 py-2"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading || success}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>

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
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border rounded px-3 py-2"
              value={formData.password}
              onChange={handleChange}
              disabled={loading || success}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
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
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-4 text-center">
            Already a user?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
