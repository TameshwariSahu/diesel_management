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
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and review all diesel allocations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Allocations" 
            value={stats.total} 
            icon="📊"
            bgColor="from-blue-500 to-blue-600"
          />
          <StatCard 
            title="Pending Review" 
            value={stats.pending} 
            icon="⏳"
            bgColor="from-yellow-500 to-yellow-600"
          />
          <StatCard 
            title="Approved" 
            value={stats.approved} 
            icon="✅"
            bgColor="from-green-500 to-green-600"
          />
          <StatCard 
            title="Rejected" 
            value={stats.rejected} 
            icon="❌"
            bgColor="from-red-500 to-red-600"
          />
        </div>

        {/* Table Card */}
        <div className="card p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Allocations</h2>
              <p className="text-gray-600 text-sm mt-1">Review and manage allocation requests</p>
            </div>
            <button 
              onClick={fetchAllAllocations}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
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
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Opening (L)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Allocated (L)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Closing (L)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.allocation_date}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.vehicle_reg_no}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.opening_balance}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">{item.allocated_diesel}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.closing_balance}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold badge
                          ${item.status === 'Approved' ? 'badge-success' : 
                            item.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => updateStatus(item.id, 'Approved')}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-semibold"
                            >
                              ✓ Approve
                            </button>
                            <button 
                              onClick={() => updateStatus(item.id, 'Rejected')}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs font-semibold"
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
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No allocations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bgColor }) => (
  <div className={`card p-6 bg-gradient-to-br ${bgColor} text-white shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
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
