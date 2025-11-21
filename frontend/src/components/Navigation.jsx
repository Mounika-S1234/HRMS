import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>HRMS</h2>
      </div>
      <ul className="nav-menu">
        <li>
          <Link to="/employees" className={`nav-link ${isActive('/employees')}`}>
            👥 Employees
          </Link>
        </li>
        <li>
          <Link to="/teams" className={`nav-link ${isActive('/teams')}`}>
            🛠️ Teams
          </Link>
        </li>
        <li>
          <Link to="/logs" className={`nav-link ${isActive('/logs')}`}>
            📋 Logs
          </Link>
        </li>
      </ul>
      <div className="nav-logout">
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navigation;
