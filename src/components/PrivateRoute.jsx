import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check for token in sessionStorage and verify it hasn't expired
  const isAuthenticated = () => {
    const tokenData = sessionStorage.getItem('token');
    
    if (!tokenData) {
      return false;
    }
    
    try {
      const token = JSON.parse(tokenData);
      
      // Check if token has expired
      if (token.expiry && new Date().getTime() > token.expiry) {
        // Token has expired, remove it
        console.log('Token expired, redirecting to login');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  };
  
  // Get the current location
  const location = window.location;
  const isEnrollmentPage = location.pathname === '/enrollment';
  
  // Special handling for enrollment page
  if (isEnrollmentPage) {
    // For the enrollment page, we only check if the user is authenticated
    // We don't check enrollment status here
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  }
  
  // For all other protected routes, check both authentication and enrollment
  if (isAuthenticated()) {
    // User is authenticated, now check if they're enrolled
    const isEnrolledStr = sessionStorage.getItem('isEnrolled');
    
    // If we have enrollment status and it's false, redirect to enrollment
    if (isEnrolledStr !== null) {
      const isEnrolled = JSON.parse(isEnrolledStr);
      if (isEnrolled === false) {
        console.log('User not enrolled, redirecting to enrollment page');
        return <Navigate to="/enrollment" replace />;
      }
    }
    
    // User is authenticated and either enrolled or enrollment status unknown
    return children;
  } else {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;