import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/logs?limit=100');
        setLogs(response.data.logs || response.data); // Handle both response formats
        setError('');
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to load logs.');
          console.error("Fetch Error:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [navigate]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionBadge = (action) => {
    const actionMap = {
      'login': 'badge-info',
      'logout': 'badge-warning',
      'employee_created': 'badge-success',
      'employee_updated': 'badge-success',
      'employee_deleted': 'badge-danger',
      'team_created': 'badge-success',
      'team_updated': 'badge-success',
      'team_deleted': 'badge-danger',
      'assigned_employee_to_team': 'badge-info',
      'unassigned_employee_from_team': 'badge-info',
    };
    return actionMap[action] || 'badge-default';
  };

  if (loading) return (
    <div className="page-container">
      <div style={{textAlign: 'center', padding: '50px'}}>
        <div className="loading"></div>
        <p style={{marginTop: '20px', fontSize: '1.1rem'}}>Loading Logs...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="error">{error}</div>
    </div>
  );

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>📋 Audit Logs</h1>
        <p className="log-count">{logs.length} total events</p>
      </header>

      {logs.length === 0 ? (
        <div className="empty-state">
          <p>No logs available yet.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>User ID</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{formatDate(log.timestamp)}</td>
                <td>
                  <span className={`badge ${getActionBadge(log.action)}`}>
                    {log.action.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </td>
                <td>{log.user_id}</td>
                <td>
                  <code className="meta-info">
                    {JSON.stringify(log.meta, null, 2)}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Logs;
