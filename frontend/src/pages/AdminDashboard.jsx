import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAllAllocations();
  }, []);

  const fetchAllAllocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/allocations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllocations(res.data);
      
      // Calculate stats
      const total = res.data.length;
      const pending = res.data.filter(a => a.status === 'Pending').length;
      const approved = res.data.filter(a => a.status === 'Approved').length;
      const rejected = res.data.filter(a => a.status === 'Rejected').length;
      setStats({ total, pending, approved, rejected });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/allocations/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchAllAllocations();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const onLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage and review all diesel allocations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Allocations" 
            value={stats.total} 
            icon="📊"
            bgGradient="from-blue-600 to-blue-700"
          />
          <StatCard 
            title="Pending Review" 
            value={stats.pending} 
            icon="⏳"
            bgGradient="from-amber-600 to-amber-700"
          />
          <StatCard 
            title="Approved" 
            value={stats.approved} 
            icon="✅"
            bgGradient="from-green-600 to-green-700"
          />
          <StatCard 
            title="Rejected" 
            value={stats.rejected} 
            icon="❌"
            bgGradient="from-red-600 to-red-700"
          />
        </div>

        {/* Table Card */}
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">All Allocations</h2>
              <p className="text-slate-400 text-sm mt-1">Review and manage allocation requests</p>
            </div>
            <button 
              onClick={fetchAllAllocations}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition font-semibold text-sm"
            >
              🔄 Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : allocations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Vehicle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Opening (L)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Allocated (L)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Closing (L)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((item) => (
                    <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4 text-sm text-slate-300">{item.allocation_date}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">{item.vehicle_reg_no}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{item.opening_balance}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-400">{item.allocated_diesel}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{item.closing_balance}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${item.status === 'Approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                            item.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => updateStatus(item.id, 'Approved')}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold transition"
                            >
                              ✓ Approve
                            </button>
                            <button 
                              onClick={() => updateStatus(item.id, 'Rejected')}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg">No allocations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bgGradient }) => (
  <div className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-4xl font-bold mt-2">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

export default AdminDashboard;
