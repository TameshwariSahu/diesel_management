import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { getTodayInputValue } from '../utils/date';
import { useTheme } from '../context/ThemeContext';

const NewAllocation = ({ onSuccess }) => {
  const { isDark } = useTheme();
  const theme = {
    cardBg: isDark ? '#0F172A' : '#FFFFFF',
    text: isDark ? '#F1F5F9' : '#1E293B',
    subText: isDark ? '#94A3B8' : '#64748B',
    inputBg: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
    inputBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.12)',
    mutedInputBg: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
    border: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(15,23,42,0.08)'
  };
  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: theme.inputBg,
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: '8px', padding: '9px 12px',
    color: theme.text, fontSize: '13px',
    textTransform: 'Capitalize',
  };
  const labelStyle = {
    color: theme.subText, fontSize: '11px', fontWeight: 500,
    display: 'block', marginBottom: '5px', letterSpacing: '0.3px',
  };
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
  allocation_date: getTodayInputValue(),
  vehicle_id: '',
  opening_reading: '',     
  closing_reading: '',     
  remarks: ''
});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

    useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    axios.get(`${API_BASE_URL}/api/masters/vehicles`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { all: true }
    }).then(res => {
      const allVehicles = res.data.data || res.data || []; 
      
      const filtered = allVehicles.filter(v => 
        v.department_id == user.department_id && v.status === 'active' 
      );
      setVehicles(filtered);
    }).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const updated = {
      ...formData,
      [e.target.name]: e.target.value
    };

    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const openingReading = Number(formData.opening_reading);
    const closingReading = Number(formData.closing_reading);

    if (closingReading <= openingReading) {
      setMessage('error:Closing reading must be greater than opening reading.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const result = await axios.post(
        `${API_BASE_URL}/api/allocations`,
        {
          ...formData,
          vehicle_id: Number(formData.vehicle_id),
          section_id: vehicles.find(v => String(v.id) === String(formData.vehicle_id))?.section_id || null,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
console.log("result",result)
      setMessage('success');
      setTimeout(() => onSuccess?.(), 1500);
    } catch (err) {
      setMessage('error:' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.border}`,
      borderRadius: '16px', padding: '1.75rem',
    }}>
      <h2 style={{ color: theme.text, fontSize: '17px', fontWeight: 600, margin: '0 0 4px' }}>
        New Diesel Allocation
      </h2>
      <p style={{ color: theme.subText, fontSize: '13px', margin: '0 0 1.5rem' }}>
        Submit a fuel allocation request for admin approval
      </p>

      {message === 'success' && (
        <div style={{
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '8px', padding: '10px 14px', color: '#34D399',
          fontSize: '13px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          ✓ Submitted successfully — pending approval
        </div>
      )}

      {message.startsWith('error:') && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '8px', padding: '10px 14px', color: '#F87171',
          fontSize: '13px', marginBottom: '1rem'
        }}>
          ⚠ {message.slice(6)}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={labelStyle}>ALLOCATION DATE</label>
            <input style={inputStyle} type="date" name="allocation_date"
              value={formData.allocation_date} onChange={handleChange} required />
          </div>
          <div>
            <label style={labelStyle}>VEHICLE</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }}
              name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} required>
              <option value="">Select vehicle</option>
              {vehicles.filter(v => v.status === 'active')
              .map(v => (
                <option key={v.id} value={v.id}>{v.reg_no} — {v.vehicle_type}</option>
              ))}
            </select>
          </div>
        </div>

                {/* ✅ UPDATED: Reading Inputs Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>OPENING READING (KM)</label>
            <input 
              style={inputStyle} 
              type="number" 
              name="opening_reading"
              step="0.01"
              value={formData.opening_reading} 
              onChange={handleChange} 
              required 
              placeholder="0.00" 
            />
          </div>
        
          <div>
            <label style={labelStyle}>CLOSING READING (KM)</label>
            <input 
              style={inputStyle}
              type="number" 
              name="closing_reading"
              step="0.01"
              value={formData.closing_reading} 
              onChange={handleChange} 
              required 
              placeholder="0.00" 
            />
          </div>

          <div>
            <label style={labelStyle}>TOTAL DISTANCE (KM)</label>
            <input 
              style={{ ...inputStyle, background: theme.mutedInputBg, color: theme.subText, cursor: 'not-allowed' }}
              type="number" 
              value={((Number(formData.closing_reading) || 0) - (Number(formData.opening_reading) || 0)).toFixed(2)} 
              readOnly 
              placeholder="Auto" 
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div>
            <label style={labelStyle}>REMARKS</label>
            <input style={inputStyle} type="text" name="remarks"
              value={formData.remarks} onChange={handleChange} placeholder="Optional" />
          </div>
        </div>

        <button type="submit" disabled={loading} style={{
          background: loading ? '#1E3A5F' : '#3B82F6',
          border: 'none', borderRadius: '8px', padding: '10px 24px',
          color: '#fff', fontSize: '13px', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s',
        }}>
          {loading ? 'Submitting...' : '✓ Submit for Approval'}
        </button>
      </form>
    </div>
  );
};

export default NewAllocation;


