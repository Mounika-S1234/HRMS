import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const RegisterOrg = () => {
  const [formData, setFormData] = useState({
    orgName: '',
    adminName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register(formData);
      
      // Save token and user info upon successful registration
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Navigate to the main application view (e.g., Employees page)
      navigate('/employees'); 
    } catch (err) {
      // Check for specific error message from the backend (e.g., duplicate email)
      const message = err.response?.data?.message || 'Registration failed due to server error.';
      setError(message);
      console.error("Registration Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register New Organization</h2>
      <form onSubmit={handleSubmit} className="register-form">
        {error && <p className="error-message">{error}</p>}
        
        <input
          type="text"
          name="orgName"
          value={formData.orgName}
          onChange={handleChange}
          placeholder="Organization Name"
          required
        />
        <input
          type="text"
          name="adminName"
          value={formData.adminName}
          onChange={handleChange}
          placeholder="Admin Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Admin Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register & Log In'}
        </button>
      </form>
      <p>
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterOrg;