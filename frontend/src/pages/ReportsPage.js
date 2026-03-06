import React, { useState, useEffect } from 'react';
import { reportService } from '../services';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ status: '', reportType: '' });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reportType: 'monthly',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      const response = await reportService.getAllReports(filters);
      setReports(response.data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reportService.generateReport(formData);
      alert('Report generated successfully');
      setFormData({ reportType: 'monthly', startDate: '', endDate: '' });
      setShowForm(false);
      fetchReports();
    } catch (err) {
      setError('Failed to generate report');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Reports</h1>
      <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px' }}>
        {showForm ? '✕ Cancel' : '📄 Generate Report'}
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>Generate Report</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div>
                <label>Report Type</label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>

              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-success">Generate Report</button>
          </form>
        </div>
      )}

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Filters</h3>
        <div style={styles.filterGrid}>
          <div>
            <label>Status</label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label>Report Type</label>
            <select value={filters.reportType} onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}>
              <option value="">All</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {reports.length === 0 ? (
          <p>No reports generated yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Type</th>
                <th>Period</th>
                <th>Total Waste (kg)</th>
                <th>Collections</th>
                <th>Completion Rate</th>
                <th>Status</th>
                <th>Generated Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td>{r.reportId}</td>
                  <td>{r.reportType}</td>
                  <td>
                    {new Date(r.period.startDate).toLocaleDateString()} - {new Date(r.period.endDate).toLocaleDateString()}
                  </td>
                  <td>{r.summary.totalWasteCollected.amount}</td>
                  <td>{r.summary.collectionCount}</td>
                  <td>{r.summary.completionRate}%</td>
                  <td>{r.status}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '15px'
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  }
};

export default ReportsPage;
