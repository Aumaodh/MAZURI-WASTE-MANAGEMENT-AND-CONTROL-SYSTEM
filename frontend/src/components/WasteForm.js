import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { wasteService } from '../services';

const WasteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    source: 'residential',
    location: '',
    wasteType: 'organic',
    quantity: { amount: 0, unit: 'kg' },
    description: '',
    pickupScheduled: '',
    contactPerson: { name: '', phone: '', email: '' }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchWaste();
    }
  }, [id]);

  const fetchWaste = async () => {
    try {
      const response = await wasteService.getWasteById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load waste data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await wasteService.updateWaste(id, formData);
        alert('Waste updated successfully');
      } else {
        await wasteService.createWaste(formData);
        alert('Waste created successfully');
      }
      navigate('/waste');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>{id ? 'Edit Waste' : 'Create New Waste Entry'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Waste Source</label>
          <select name="source" value={formData.source} onChange={handleChange} required>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="institutional">Institutional</option>
            <option value="agricultural">Agricultural</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Waste Type</label>
          <select name="wasteType" value={formData.wasteType} onChange={handleChange} required>
            <option value="organic">Organic</option>
            <option value="recyclable">Recyclable</option>
            <option value="hazardous">Hazardous</option>
            <option value="electronic">Electronic</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Quantity (Amount)</label>
          <input type="number" name="quantity.amount" value={formData.quantity.amount} onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Quantity (Unit)</label>
          <select name="quantity.unit" value={formData.quantity.unit} onChange={handleChange}>
            <option value="kg">kg</option>
            <option value="tons">tons</option>
            <option value="liters">liters</option>
            <option value="bags">bags</option>
            <option value="boxes">boxes</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Pickup Scheduled</label>
          <input type="datetime-local" name="pickupScheduled" value={formData.pickupScheduled} onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contact Person Name</label>
          <input type="text" name="contactPerson.name" value={formData.contactPerson.name} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contact Phone</label>
          <input type="tel" name="contactPerson.phone" value={formData.contactPerson.phone} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contact Email</label>
          <input type="email" name="contactPerson.email" value={formData.contactPerson.email} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" className="btn-primary" onClick={() => navigate('/waste')} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default WasteForm;
