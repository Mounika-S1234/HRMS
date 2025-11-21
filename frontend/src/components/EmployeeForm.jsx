import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EmployeeForm = ({ employee, onSuccess, onCancel }) => {
  const isEditing = !!employee;
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Effect to load data when editing
  useEffect(() => {
    if (isEditing) {
      setFormData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
      });
    }
  }, [employee, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        // PUT request for updating
        await api.put(`/employees/${employee.id}`, formData);
      } else {
        // POST request for creating
        await api.post('/employees', formData);
      }
      onSuccess(); // Close form and refresh list
    } catch (err) {
      const message = err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} employee.`;
      setError(message);
      console.error("Form Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h3>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h3>
      {error && <p className="error-message">{error}</p>}
      
      <div className="form-group">
        <label>First Name</label>
        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="button secondary-button">Cancel</button>
        <button type="submit" disabled={loading} className="button primary-button">
          {loading ? 'Saving...' : (isEditing ? 'Update Employee' : 'Create Employee')}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;