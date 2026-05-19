import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const NewAllocation = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    allocation_date: new Date().toISOString().split('T')[0],
    vehicle_reg_no: '',
    opening_balance: 0,
    allocated_diesel: 0,
    closing_balance: 0,
    authorized_by: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/masters/vehicles', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateClosing = () => {
    const closing = parseFloat(formData.opening_balance) + parseFloat(formData.allocated_diesel);
    setFormData(prev => ({ ...prev, closing_balance: closing || 0 }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'opening_balance' || e.target.name === 'allocated_diesel') {
      setTimeout(calculateClosing, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:5000/api/allocations', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage("✅ Entry Submitted Successfully (Pending Approval)");
      setFormData({
        allocation_date: new Date().toISOString().split('T')[0],
        vehicle_reg_no: '',
        opening_balance: 0,
        allocated_diesel: 0,
        closing_balance: 0,
        authorized_by: '',
        remarks: ''
      });
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={() => {
        localStorage.clear();
        window.location.href = '/';
      }} />

      <div className="max-w-2xl mx-auto p-6">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">New Diesel Allocation</h2>

          {message && (
            <div className={`p-4 mb-6 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="allocation_date"
                  value={formData.allocation_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration No.</label>
                <select
                  name="vehicle_reg_no"
                  value={formData.vehicle_reg_no}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.reg_no} value={v.reg_no}>
                      {v.reg_no} - {v.vehicle_type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance (L)</label>
                <input
                  type="number"
                  name="opening_balance"
                  value={formData.opening_balance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allocated Diesel (L)</label>
                <input
                  type="number"
                  name="allocated_diesel"
                  value={formData.allocated_diesel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Balance (L)</label>
                <input
                  type="number"
                  value={formData.closing_balance}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Authorized By</label>
              <input
                type="text"
                name="authorized_by"
                value={formData.authorized_by}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition"
            >
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAllocation;