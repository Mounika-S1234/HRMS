import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TeamForm = ({ team, employees, onSuccess, onCancel, onAssign }) => {
  const isEditing = !!team;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  // Local state to manage the team's current members (for UI display during editing)
  const [currentMembers, setCurrentMembers] = useState(team?.Employees || []); 

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: team.name || '',
        description: team.description || '',
      });
    }
    // Re-sync current members if team prop changes
    if (team?.Employees) {
      setCurrentMembers(team.Employees);
    }
  }, [team, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- CRUD Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/teams/${team.id}`, formData);
      } else {
        await api.post('/teams', formData);
      }
      onSuccess(); // Close form and refresh list
    } catch (err) {
      const message = err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} team.`;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // --- Assignment Handler ---
  const handleAssignClick = async () => {
    if (!selectedEmployeeId) {
      setError("Please select an employee to assign.");
      return;
    }
    
    // Check if already assigned (to prevent redundant calls/errors)
    const isAlreadyMember = currentMembers.some(member => member.id === parseInt(selectedEmployeeId));
    if (isAlreadyMember) {
        setError("Employee is already a member of this team.");
        return;
    }

    try {
        await onAssign(team.id, parseInt(selectedEmployeeId), 'assign');
        // Manually update local state for immediate UI feedback
        const assignedEmployee = employees.find(e => e.id === parseInt(selectedEmployeeId));
        setCurrentMembers([...currentMembers, assignedEmployee]);
        setSelectedEmployeeId('');
        setError('');
    } catch (err) {
        setError("Failed to assign employee.");
    }
  };

  // --- Unassignment Handler ---
  const handleUnassignClick = async (employeeId) => {
    try {
        await onAssign(team.id, employeeId, 'unassign');
        // Manually update local state for immediate UI feedback
        setCurrentMembers(currentMembers.filter(member => member.id !== employeeId));
        setError('');
    } catch (err) {
        setError("Failed to unassign employee.");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h3>{isEditing ? 'Manage Team: ' + team.name : 'Create New Team'}</h3>
      {error && <p className="error-message">{error}</p>}
      
      <div className="form-group">
        <label>Team Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="button secondary-button">Cancel</button>
        <button type="submit" disabled={loading} className="button primary-button">
          {loading ? 'Saving...' : (isEditing ? 'Update Details' : 'Create Team')}
        </button>
      </div>

      {/* --- Assignment Section (Visible only when editing) --- */}
      {isEditing && (
        <div className="assignment-section">
          <h4>Assign Employees</h4>
          <div className="assignment-control">
            <select 
              value={selectedEmployeeId} 
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              required
            >
              <option value="">Select Employee</option>
              {employees
                // Filter out employees already in the team for cleaner UI
                .filter(emp => !currentMembers.some(member => member.id === emp.id)) 
                .map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} ({emp.email})
                </option>
              ))}
            </select>
            <button type="button" onClick={handleAssignClick} className="button small-button assign-button">
              Assign
            </button>
          </div>

          <div className="member-list">
            <h5>Current Members ({currentMembers.length})</h5>
            <ul>
              {currentMembers.map(member => (
                <li key={member.id}>
                  {member.first_name} {member.last_name}
                  <button 
                    type="button" 
                    onClick={() => handleUnassignClick(member.id)}
                    className="button tiny-button remove-button"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </form>
  );
};

export default TeamForm;