import React, { useState, useEffect } from 'react';
import { userService } from '../services';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ role: '', isActive: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'viewer',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers(filters);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.changeUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      alert('Role updated successfully');
    } catch (err) {
      setError('Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
        alert('User deleted successfully');
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Management</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Filters</h3>
        <div style={styles.filterGrid}>
          <div>
            <label>Role</label>
            <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="waste-manager">Waste Manager</option>
              <option value="collector">Collector</option>
              <option value="supervisor">Supervisor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={filters.isActive} onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}>
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Location</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || '-'}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    style={{ padding: '5px' }}
                  >
                    <option value="admin">Admin</option>
                    <option value="waste-manager">Waste Manager</option>
                    <option value="collector">Collector</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td>{u.location || '-'}</td>
                <td>
                  <span style={u.isActive ? { color: 'green' } : { color: 'red' }}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-danger" onClick={() => handleDelete(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  }
};

export default UsersPage;
