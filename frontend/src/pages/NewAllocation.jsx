import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewAllocation = ({ onSuccess }) => {
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
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 shadow-md fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">New Diesel Allocation</h2>
      <p className="text-gray-600 text-sm mb-6">Submit a new fuel allocation request for admin approval</p>

      {message && (
        <div className={`p-4 mb-6 rounded-lg border flex items-center gap-3 fade-in ${
          message.includes('✅') 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <span className="text-lg">{message.includes('✅') ? '✓' : '⚠️'}</span>
          <span className="font-medium">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Allocation Date</label>
            <input
              type="date"
              name="allocation_date"
              value={formData.allocation_date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Registration</label>
            <select
              name="vehicle_reg_no"
              value={formData.vehicle_reg_no}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Balance (L)</label>
            <input
              type="number"
              name="opening_balance"
              value={formData.opening_balance}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Allocated Diesel (L)</label>
            <input
              type="number"
              name="allocated_diesel"
              value={formData.allocated_diesel}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Closing Balance (L)</label>
            <input
              type="number"
              value={formData.closing_balance}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              readOnly
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Authorized By</label>
            <input
              type="text"
              name="authorized_by"
              value={formData.authorized_by}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Officer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks (Optional)</label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Submitting...
            </span>
          ) : (
            '✓ Submit for Approval'
          )}
        </button>
      </form>
    </div>
  );
};

export default NewAllocation;
