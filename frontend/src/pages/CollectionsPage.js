import React, { useState, useEffect } from 'react';
import { collectionService, wasteService, userService } from '../services';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [waste, setWaste] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ status: '' });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    wasteId: '',
    collectorId: '',
    collectionDate: '',
    actualQuantity: { amount: 0, unit: 'kg' },
    location: '',
    vehicleId: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const collResponse = await collectionService.getAllCollections(filters);
      const wasteResponse = await wasteService.getAllWaste({});
      const usersResponse = await userService.getAllUsers({ role: 'collector' });

      setCollections(collResponse.data);
      setWaste(wasteResponse.data);
      setUsers(usersResponse.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await collectionService.createCollection(formData);
      alert('Collection created successfully');
      setFormData({
        wasteId: '',
        collectorId: '',
        collectionDate: '',
        actualQuantity: { amount: 0, unit: 'kg' },
        location: '',
        vehicleId: '',
        notes: ''
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError('Failed to create collection');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await collectionService.updateCollection(id, { status: newStatus });
      setCollections(collections.map(c => c._id === id ? { ...c, status: newStatus } : c));
      alert('Status updated successfully');
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Collections Management</h1>
      <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px' }}>
        {showForm ? '✕ Cancel' : '➕ New Collection'}
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>Create Collection</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div>
                <label>Waste</label>
                <select
                  value={formData.wasteId}
                  onChange={(e) => setFormData({ ...formData, wasteId: e.target.value })}
                  required
                >
                  <option value="">Select Waste</option>
                  {waste.map(w => (
                    <option key={w._id} value={w._id}>{w.wasteId} - {w.location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Collector</label>
                <select
                  value={formData.collectorId}
                  onChange={(e) => setFormData({ ...formData, collectorId: e.target.value })}
                  required
                >
                  <option value="">Select Collector</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Collection Date</label>
                <input
                  type="datetime-local"
                  value={formData.collectionDate}
                  onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <label>Vehicle ID</label>
                <input
                  type="text"
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                />
              </div>

              <div>
                <label>Quantity (Amount)</label>
                <input
                  type="number"
                  value={formData.actualQuantity.amount}
                  onChange={(e) => setFormData({
                    ...formData,
                    actualQuantity: { ...formData.actualQuantity, amount: parseFloat(e.target.value) }
                  })}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
              ></textarea>
            </div>

            <button type="submit" className="btn-success">Create Collection</button>
          </form>
        </div>
      )}

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Filters</h3>
        <select value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Collection ID</th>
              <th>Waste ID</th>
              <th>Collector</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr key={c._id}>
                <td>{c.collectionId}</td>
                <td>{c.wasteId?.wasteId}</td>
                <td>{c.collectorId?.name}</td>
                <td>{c.location}</td>
                <td>{c.actualQuantity.amount} {c.actualQuantity.unit}</td>
                <td>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                    style={{ padding: '5px' }}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
                <td>{new Date(c.collectionDate).toLocaleDateString()}</td>
                <td>View Details</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '15px'
  }
};

export default CollectionsPage;
