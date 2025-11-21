import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import Pages
import Login from './src/pages/Login.jsx';
import RegisterOrg from './src/pages/RegisterOrg.jsx';
import Employees from './src/pages/Employees.jsx';
import Teams from './src/pages/Teams.jsx';

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

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/employees" element={<Employees />} />
          <Route path="/teams" element={<Teams />} />
        </Route>
        
        {/* Catch-all for 404 */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;