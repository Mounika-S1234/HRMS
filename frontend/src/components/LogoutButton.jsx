import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication tokens and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect the user to the login page
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="button tertiary-button logout-button">
      Log Out
    </button>
  );
};

export default LogoutButton;