import React, { useState, useEffect } from 'react';
import { wasteService, collectionService, reportService } from '../services';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalWaste: 0,
    totalCollections: 0,
    completionRate: 0,
    wasteStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const wasteStats = await wasteService.getWasteStats();
      const collectionStats = await collectionService.getCollectionStats();

      const totalWaste = wasteStats.data.reduce((sum, stat) => sum + stat.totalQuantity, 0);

      setStats({
        totalWaste: totalWaste.toFixed(2),
        totalCollections: collectionStats.data.reduce((sum, stat) => sum + stat.count, 0),
        completionRate: collectionStats.data
          .find(s => s._id === 'completed')
          ?.count || 0,
        wasteStats: wasteStats.data
      });
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div style={styles.statsContainer}>
        <div className="card" style={styles.statCard}>
          <h3>Total Waste Collected</h3>
          <p style={styles.statValue}>{stats.totalWaste} kg</p>
        </div>
        <div className="card" style={styles.statCard}>
          <h3>Total Collections</h3>
          <p style={styles.statValue}>{stats.totalCollections}</p>
        </div>
        <div className="card" style={styles.statCard}>
          <h3>Completed Collections</h3>
          <p style={styles.statValue}>{stats.completionRate}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Waste Distribution by Type</h3>
        <table>
          <thead>
            <tr>
              <th>Waste Type</th>
              <th>Count</th>
              <th>Total Quantity (kg)</th>
            </tr>
          </thead>
          <tbody>
            {stats.wasteStats.map((stat) => (
              <tr key={stat._id}>
                <td>{stat._id}</td>
                <td>{stat.count}</td>
                <td>{stat.totalQuantity.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  statCard: {
    textAlign: 'center'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '10px 0'
  }
};

export default DashboardPage;
