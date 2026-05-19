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
      setMessage("Entry Submitted Successfully (Pending Approval)");
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
      setMessage("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">New Diesel Allocation</h2>
      <p className="text-slate-400 text-sm mb-6">Submit a new fuel allocation request for admin approval</p>

      {message && (
        <div className={`p-4 mb-6 rounded-lg border flex items-center gap-3 ${
          message.includes('Successfully') 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <span className="text-lg">{message.includes('Successfully') ? '✓' : '⚠️'}</span>
          <span className="font-medium">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Allocation Date</label>
            <input
              type="date"
              name="allocation_date"
              value={formData.allocation_date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Vehicle Registration</label>
            <select
              name="vehicle_reg_no"
              value={formData.vehicle_reg_no}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
            <label className="block text-sm font-semibold text-slate-200 mb-2">Opening Balance (L)</label>
            <input
              type="number"
              name="opening_balance"
              value={formData.opening_balance}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Allocated Diesel (L)</label>
            <input
              type="number"
              name="allocated_diesel"
              value={formData.allocated_diesel}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Closing Balance (L)</label>
            <input
              type="number"
              value={formData.closing_balance}
              className="w-full px-4 py-3 bg-slate-600/50 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
              readOnly
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Authorized By</label>
            <input
              type="text"
              name="authorized_by"
              value={formData.authorized_by}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Officer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Remarks (Optional)</label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Any additional notes"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
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
