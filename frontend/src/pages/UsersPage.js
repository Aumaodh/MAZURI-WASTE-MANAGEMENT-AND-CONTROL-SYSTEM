import React, { useState, useEffect } from 'react';
import { userService } from '../services';

const defaultFormData = {
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'viewer',
  location: '',
  isActive: true
};

const UsersPage = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ role: '', isActive: '' });
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

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
    const { name, value, type, checked } = e.target;
    const normalizedValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: normalizedValue });
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingUserId(null);
    setFormMode('create');
  };

  const openCreateForm = () => {
    if (showForm && formMode === 'create') {
      setShowForm(false);
      resetForm();
      return;
    }

    resetForm();
    setFormMode('create');
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setFormMode('edit');
    setEditingUserId(user._id);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      role: user.role || 'viewer',
      location: user.location || '',
      isActive: !!user.isActive
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (formMode === 'create') {
        const payload = { ...formData };
        if (!payload.phone) delete payload.phone;
        if (!payload.location) delete payload.location;

        const response = await userService.createUser(payload);
        setUsers((prevUsers) => [response.data.user, ...prevUsers]);
        alert('User created successfully');
      } else {
        const payload = {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          role: formData.role,
          isActive: formData.isActive
        };

        const response = await userService.updateUser(editingUserId, payload);
        setUsers((prevUsers) => prevUsers.map((u) => (
          u._id === editingUserId ? response.data.user : u
        )));
        alert('User updated successfully');
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${formMode === 'create' ? 'create' : 'update'} user`);
    } finally {
      setSaving(false);
    }
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

  const handleResetPassword = async (user) => {
    setResetUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setShowResetModal(true);
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setResetUser(null);
    setNewPassword('');
    setConfirmPassword('');
  };

  const submitPasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setResettingPassword(true);
      await userService.resetUserPassword(resetUser._id, newPassword);
      closeResetModal();
      alert('Password reset successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResettingPassword(false);
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

  if (!currentUser || currentUser.role !== 'admin') {
    return <div className="alert alert-danger">Only admins can access user management.</div>;
  }

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={{ margin: 0 }}>User Management</h1>
        <button className="btn-primary" style={styles.primaryActionBtn} onClick={openCreateForm}>
          {showForm && formMode === 'create' ? 'Cancel' : '+ Add New User'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{formMode === 'create' ? 'Create User' : 'Edit User'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div>
                <label>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={formMode === 'edit'}
                />
              </div>
              {formMode === 'create' && (
                <div>
                  <label>Password</label>
                  <input name="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} />
                </div>
              )}
              <div>
                <label>Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div>
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="admin">Admin</option>
                  <option value="waste-manager">Waste Manager</option>
                  <option value="collector">Collector</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label>Location</label>
                <input name="location" value={formData.location} onChange={handleChange} />
              </div>
              {formMode === 'edit' && (
                <div style={styles.checkboxWrap}>
                  <label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      style={styles.checkbox}
                    />
                    Active User
                  </label>
                </div>
              )}
            </div>
            <div style={{ marginTop: '15px' }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? (formMode === 'create' ? 'Creating...' : 'Updating...') : (formMode === 'create' ? 'Create User' : 'Update User')}
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                style={{ marginLeft: '10px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
                  <button className="btn-primary" style={{ marginRight: '8px' }} onClick={() => openEditForm(u)}>
                    Edit
                  </button>
                  <button className="btn-success" style={{ marginRight: '8px' }} onClick={() => handleResetPassword(u)}>
                    Reset Password
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showResetModal && (
        <div style={styles.modalOverlay}>
          <div className="card" style={styles.modalCard}>
            <h3>Reset Password</h3>
            <p style={{ marginTop: 0 }}>User: <strong>{resetUser?.email}</strong></p>
            <form onSubmit={submitPasswordReset}>
              <div style={{ marginBottom: '12px' }}>
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <div>
                <button type="submit" className="btn-primary" disabled={resettingPassword}>
                  {resettingPassword ? 'Resetting...' : 'Reset Password'}
                </button>
                <button type="button" className="btn-danger" style={{ marginLeft: '10px' }} onClick={closeResetModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px'
  },
  primaryActionBtn: {
    fontWeight: 600,
    minWidth: '170px'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalCard: {
    width: '100%',
    maxWidth: '460px'
  },
  checkboxWrap: {
    display: 'flex',
    alignItems: 'center'
  },
  checkbox: {
    width: 'auto',
    marginRight: '8px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  }
};

export default UsersPage;
