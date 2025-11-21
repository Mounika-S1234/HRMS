import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import Pages
import Login from './pages/Login.jsx';
import RegisterOrg from './pages/RegisterOrg.jsx';
import Employees from './pages/Employees.jsx';
import Teams from './pages/Teams.jsx';
import Logs from './components/Logs.jsx';
import Navigation from './components/Navigation.jsx';

// --- Layout Component with Navigation ---
const LayoutWithNav = () => {
  return (
    <div>
      <Navigation />
      <div style={{ padding: '0 20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

// --- Private Route Component ---
const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('token');
  
  // Renders the protected page if token exists, otherwise redirects to /login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterOrg />} />
        
        {/* Default redirect for / */}
        <Route path="/" element={<Navigate to="/employees" />} />

        {/* Protected Routes with Navigation */}
        <Route element={<PrivateRoute />}>
          <Route element={<LayoutWithNav />}>
            <Route path="/employees" element={<Employees />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/logs" element={<Logs />} />
          </Route>
        </Route>
        
        {/* Catch-all for 404 */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
