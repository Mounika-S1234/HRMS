import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EmployeeForm from '../components/EmployeeForm'; 
import { Link, useNavigate } from 'react-router-dom';const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const navigate = useNavigate();

  // Helper function to fetch employee data
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees'); // Uses the interceptor for token
      setEmployees(response.data);
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token expired or invalid, handle logout locally
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to load employees.');
        console.error("Fetch Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees(); // Refresh the list
    } catch (err) {
      setError('Failed to delete employee.');
      console.error("Delete Error:", err);
    }
  };
  
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchEmployees(); // Refresh after C/U operation
  };

  if (loading) return (
    <div className="page-container">
      <div style={{textAlign: 'center', padding: '50px'}}>
        <div className="loading"></div>
        <p style={{marginTop: '20px', fontSize: '1.1rem'}}>Loading Employees...</p>
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
        <h1>👥 Employee Management</h1>
        <div className="actions">
          <Link to="/teams" className="button secondary-button">Manage Teams</Link>
          <button onClick={handleCreate} className="button primary-button">
            + Add New Employee
          </button>
        </div>
      </header>      {/* Employee Form Modal */}
      {isFormOpen && (
        <div className="modal">
          <div className="modal-content">
            <EmployeeForm 
              employee={editingEmployee}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Employee List Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Teams</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.first_name} {emp.last_name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>
                {emp.Teams && emp.Teams.length ? (
                  emp.Teams.map((t, i) => (
                    <span key={t.id} className="tag">
                      {t.name}{i < emp.Teams.length - 1 ? ', ' : ''}
                    </span>
                  ))
                ) : 'N/A'}
              </td>
              <td>
                <button onClick={() => handleEdit(emp)} className="button small-button">Edit</button>
                <button onClick={() => handleDelete(emp.id)} className="button small-button delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;