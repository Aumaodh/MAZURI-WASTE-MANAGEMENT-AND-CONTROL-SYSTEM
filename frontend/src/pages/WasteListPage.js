import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wasteService } from '../services';

const WasteListPage = () => {
  const [waste, setWaste] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    wasteType: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWaste();
  }, [filters]);

  const fetchWaste = async () => {
    try {
      const response = await wasteService.getAllWaste(filters);
      setWaste(response.data);
    } catch (err) {
      setError('Failed to load waste data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await wasteService.deleteWaste(id);
        setWaste(waste.filter(w => w._id !== id));
      } catch (err) {
        setError('Failed to delete waste');
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Waste Management</h1>
      <button className="btn-primary" onClick={() => navigate('/waste/new')} style={{ marginBottom: '20px' }}>
        ➕ Add New Waste
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Filters</h3>
        <div style={styles.filterContainer}>
          <div style={styles.filterField}>
            <label>Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="collected">Collected</option>
              <option value="processed">Processed</option>
              <option value="disposed">Disposed</option>
            </select>
          </div>
          <div style={styles.filterField}>
            <label>Source</label>
            <select name="source" value={filters.source} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="institutional">Institutional</option>
              <option value="agricultural">Agricultural</option>
            </select>
          </div>
          <div style={styles.filterField}>
            <label>Waste Type</label>
            <select name="wasteType" value={filters.wasteType} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="organic">Organic</option>
              <option value="recyclable">Recyclable</option>
              <option value="hazardous">Hazardous</option>
              <option value="electronic">Electronic</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Waste ID</th>
              <th>Source</th>
              <th>Type</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Scheduled Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {waste.map((w) => (
              <tr key={w._id}>
                <td>{w.wasteId}</td>
                <td>{w.source}</td>
                <td>{w.wasteType}</td>
                <td>{w.location}</td>
                <td>{w.quantity.amount} {w.quantity.unit}</td>
                <td>
                  <span style={getStatusColor(w.status)}>
                    {w.status}
                  </span>
                </td>
                <td>{new Date(w.pickupScheduled).toLocaleDateString()}</td>
                <td>
                  <button className="btn-primary" onClick={() => navigate(`/waste/${w._id}/edit`)}>
                    Edit
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(w._id)} style={{ marginLeft: '5px' }}>
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

const getStatusColor = (status) => {
  const colors = {
    pending: { backgroundColor: '#fff3cd', color: '#856404', padding: '5px 10px', borderRadius: '4px' },
    scheduled: { backgroundColor: '#d1ecf1', color: '#0c5460', padding: '5px 10px', borderRadius: '4px' },
    collected: { backgroundColor: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '4px' },
    processed: { backgroundColor: '#cce5ff', color: '#004085', padding: '5px 10px', borderRadius: '4px' },
    disposed: { backgroundColor: '#f8d7da', color: '#721c24', padding: '5px 10px', borderRadius: '4px' }
  };
  return colors[status] || {};
};

const styles = {
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  filterField: {
    display: 'flex',
    flexDirection: 'column'
  }
};

export default WasteListPage;
