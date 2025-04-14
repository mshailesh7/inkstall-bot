// src/services/apiClient.js
import axios from 'axios';

// IMPORTANT: Replace with your actual backend API base URL
// You can use environment variables for this: process.env.REACT_APP_API_BASE_URL
// For development, you might proxy requests via package.json "proxy" field
// or run backend on a specific port. Using a placeholder here.
const API_BASE_URL = '/api/v1'; // Placeholder - ADJUST AS NEEDED

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add Authorization headers here if needed, e.g., dynamically from auth state
    // 'Authorization': `Bearer ${token}`
  },
  timeout: 10000, // 10 second timeout
});

// Optional: Add interceptors for global error handling or request/response manipulation
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Handle errors globally if desired (e.g., redirect on 401, log errors)
    console.error('API call error:', error.response || error.message);
    // You might want to transform the error structure here
    return Promise.reject(error);
  }
);

export default apiClient;