import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TeamForm from '../components/TeamForm'; 
import { useNavigate } from 'react-router-dom';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]); // To populate assignment lists
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const navigate = useNavigate();

  // Combined fetch for both teams and all available employees
  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsRes, employeesRes] = await Promise.all([
        api.get('/teams'),
        api.get('/employees')
      ]);
      setTeams(teamsRes.data);
      setEmployees(employeesRes.data);
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to load data.');
        console.error("Fetch Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (team) => {
    setEditingTeam(team);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingTeam(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      await api.delete(`/teams/${id}`);
      fetchData(); // Refresh the lists
    } catch (err) {
      setError('Failed to delete team.');
      console.error("Delete Error:", err);
    }
  };
  
  const handleAssignment = async (teamId, employeeId, action) => {
    try {
        if (action === 'assign') {
            await api.post(`/teams/${teamId}/assign`, { employeeId });
        } else {
            // Note: DELETE requests with body are discouraged, but required for this route design
            await api.delete(`/teams/${teamId}/unassign`, { data: { employeeId } });
        }
        fetchData(); // Refresh data after assignment change
    } catch (err) {
        setError(`Failed to ${action} employee.`);
        console.error("Assignment Error:", err);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchData(); // Refresh after C/U operation
  };

  if (loading) return (
    <div className="page-container">
      <div style={{textAlign: 'center', padding: '50px'}}>
        <div className="loading"></div>
        <p style={{marginTop: '20px', fontSize: '1.1rem'}}>Loading Teams...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="page-container">
      <div className="error">{error}</div>
    </div>
  );  return (
    <div className="page-container">
      <header className="page-header">
        <h1>🛠️ Team Management</h1>
        <button onClick={handleCreate} className="button primary-button">
          + Create New Team
        </button>
      </header>

      {/* Team Form Modal */}
      {isFormOpen && (
        <div className="modal">
          <div className="modal-content">
            <TeamForm 
              team={editingTeam}
              employees={employees} // Pass all employees for assignment
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
              onAssign={handleAssignment}
            />
          </div>
        </div>
      )}

      {/* Team List Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Members Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>{team.description}</td>
              <td>{team.Employees ? team.Employees.length : 0}</td>
              <td>
                <button onClick={() => handleEdit(team)} className="button small-button">Manage</button>
                <button onClick={() => handleDelete(team.id)} className="button small-button delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Teams;