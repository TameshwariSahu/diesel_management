import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import NewAllocation from './NewAllocation';

const DeptDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/allocations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllocations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Department Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your diesel allocations</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition transform hover:scale-105 active:scale-95 ${
              showForm 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600'
            }`}
          >
            {showForm ? '✕ Close Form' : '+ New Allocation'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <NewAllocation onSuccess={() => {
              setShowForm(false);
              fetchAllocations();
            }} />
          </div>
        )}

        {/* Allocations Table Card */}
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Your Allocations</h2>
            <p className="text-slate-400 text-sm mt-1">View and track all your diesel allocation requests</p>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-300">No allocations yet</p>
              <p className="text-sm text-slate-500 mt-1">Create your first allocation request to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeptDashboard;
