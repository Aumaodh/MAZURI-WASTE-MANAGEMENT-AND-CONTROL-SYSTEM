import React, { useState, useEffect } from 'react';
import { collectionService, wasteService, userService } from '../services';

const defaultPaymentForm = {
  method: 'mpesa',
  amount: '',
  phoneNumber: '',
  reference: ''
};

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCollection, setPaymentCollection] = useState(null);
  const [paymentForm, setPaymentForm] = useState(defaultPaymentForm);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyCollection, setHistoryCollection] = useState(null);

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
      setError(err?.response?.data?.message || 'Failed to create collection');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await collectionService.updateCollection(id, { status: newStatus });
      setCollections(collections.map(c => c._id === id ? { ...c, status: newStatus } : c));
      alert('Status updated successfully');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const openPaymentModal = (collection) => {
    const defaultAmount = collection?.payment?.requiredAmount || Math.ceil((collection?.actualQuantity?.amount || 0) * 50);

    setPaymentCollection(collection);
    setPaymentForm({
      ...defaultPaymentForm,
      amount: defaultAmount > 0 ? String(defaultAmount) : ''
    });
    setError('');
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    if (processingPayment) return;
    setShowPaymentModal(false);
    setPaymentCollection(null);
    setPaymentForm(defaultPaymentForm);
  };

  const openHistoryModal = (collection) => {
    setHistoryCollection(collection);
    setShowHistoryModal(true);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setHistoryCollection(null);
  };

  const submitPayment = async (e) => {
    e.preventDefault();

    if (!paymentCollection) return;

    const amount = Number(paymentForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (paymentForm.method === 'mpesa' && !paymentForm.phoneNumber.trim()) {
      setError('Phone number is required for M-Pesa payment');
      return;
    }

    try {
      setProcessingPayment(true);

      if (paymentForm.method === 'mpesa') {
        const response = await collectionService.initiatePayment(paymentCollection._id, {
          amount,
          phoneNumber: paymentForm.phoneNumber.trim()
        });
        alert(response?.data?.message || 'Payment request sent to customer phone');
      } else {
        const response = await collectionService.recordCashPayment(paymentCollection._id, {
          amount,
          reference: paymentForm.reference.trim()
        });
        alert(response?.data?.message || 'Cash payment recorded');
      }

      closePaymentModal();
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to process payment');
    } finally {
      setProcessingPayment(false);
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
              <th>Payment</th>
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
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ textTransform: 'capitalize' }}>
                      {c.payment?.status || 'unpaid'}
                    </span>
                    <small>
                      KES {c.payment?.requiredAmount || 0}
                    </small>
                    <small>
                      {c.payment?.method ? `Method: ${c.payment.method}` : 'Method: -'}
                    </small>
                  </div>
                </td>
                <td>{new Date(c.collectionDate).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      className="btn-primary"
                      onClick={() => openPaymentModal(c)}
                      disabled={c.payment?.status === 'paid' || c.payment?.status === 'pending'}
                    >
                      {c.payment?.status === 'paid'
                        ? 'Paid'
                        : c.payment?.status === 'pending'
                          ? 'Pending Confirmation'
                          : 'Record Payment'}
                    </button>
                    <button className="btn-success" onClick={() => openHistoryModal(c)}>
                      History
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPaymentModal && (
        <div style={styles.modalOverlay}>
          <div className="card" style={styles.modalCard}>
            <h3 style={{ marginTop: 0 }}>Process Payment</h3>
            <p>
              <strong>{paymentCollection?.collectionId}</strong>
            </p>

            <form onSubmit={submitPayment}>
              <div style={{ marginBottom: '12px' }}>
                <label>Payment Method</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label>Amount (KES)</label>
                <input
                  type="number"
                  min="1"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  required
                />
              </div>

              {paymentForm.method === 'mpesa' && (
                <div style={{ marginBottom: '12px' }}>
                  <label>Customer Phone Number</label>
                  <input
                    type="text"
                    placeholder="07XXXXXXXX or 2547XXXXXXXX"
                    value={paymentForm.phoneNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, phoneNumber: e.target.value })}
                    required
                  />
                </div>
              )}

              {paymentForm.method === 'cash' && (
                <div style={{ marginBottom: '12px' }}>
                  <label>Cash Reference (Optional)</label>
                  <input
                    type="text"
                    placeholder="Receipt number or note"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-success" disabled={processingPayment}>
                  {processingPayment ? 'Processing...' : (paymentForm.method === 'mpesa' ? 'Send STK Push' : 'Confirm Cash Payment')}
                </button>
                <button type="button" className="btn-danger" onClick={closePaymentModal} disabled={processingPayment}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistoryModal && historyCollection && (
        <div style={styles.modalOverlay}>
          <div className="card" style={styles.historyModalCard}>
            <h3 style={{ marginTop: 0 }}>Payment History</h3>
            <p>
              <strong>{historyCollection.collectionId}</strong>
            </p>

            {Array.isArray(historyCollection?.payment?.history) && historyCollection.payment.history.length > 0 ? (
              <div style={styles.historyList}>
                {[...historyCollection.payment.history]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((item, index) => (
                    <div key={`${item.createdAt || ''}-${index}`} style={styles.historyItem}>
                      <div style={styles.historyTopLine}>
                        <strong style={{ textTransform: 'capitalize' }}>{item.method || '-'}</strong>
                        <span style={{ textTransform: 'capitalize' }}>{item.status || '-'}</span>
                      </div>
                      <small>KES {item.amount || 0}</small>
                      {item.phoneNumber && <small>Phone: {item.phoneNumber}</small>}
                      {item.reference && <small>Ref: {item.reference}</small>}
                      {item.message && <small>{item.message}</small>}
                      <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</small>
                    </div>
                  ))}
              </div>
            ) : (
              <p>No payment history yet.</p>
            )}

            <div style={{ marginTop: '12px' }}>
              <button type="button" className="btn-danger" onClick={closeHistoryModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
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
    maxWidth: '520px'
  },
  historyModalCard: {
    width: '100%',
    maxWidth: '680px'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '360px',
    overflowY: 'auto'
  },
  historyItem: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  historyTopLine: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '15px'
  }
};

export default CollectionsPage;
