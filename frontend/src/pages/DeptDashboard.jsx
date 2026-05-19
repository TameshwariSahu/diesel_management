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
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Department Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your diesel allocations</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition transform hover:scale-105 active:scale-95 ${
              showForm 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            {showForm ? '✕ Close Form' : '+ New Allocation'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 fade-in">
            <NewAllocation onSuccess={() => {
              setShowForm(false);
              fetchAllocations();
            }} />
          </div>
        )}

        {/* Allocations Table Card */}
        <div className="card p-6 shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Allocations</h2>
            <p className="text-gray-600 text-sm mt-1">View and track all your diesel allocation requests</p>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No allocations yet</p>
              <p className="text-sm text-gray-400 mt-1">Create your first allocation request to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeptDashboard;
