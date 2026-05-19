import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAllAllocations();
  }, []);

  const fetchAllAllocations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/allocations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllocations(res.data);
    } catch (err) {
      console.error(err);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">All Diesel Allocations</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Vehicle No.</th>
                  <th className="p-3 text-left">Opening</th>
                  <th className="p-3 text-left">Allocated</th>
                  <th className="p-3 text-left">Closing</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{item.allocation_date}</td>
                    <td className="p-3 font-medium">{item.vehicle_reg_no}</td>
                    <td className="p-3">{item.opening_balance}</td>
                    <td className="p-3 text-blue-600">{item.allocated_diesel}</td>
                    <td className="p-3">{item.closing_balance}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${item.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                          item.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {item.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateStatus(item.id, 'Approved')}
                            className="bg-green-600 text-white px-4 py-1 rounded text-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => updateStatus(item.id, 'Rejected')}
                            className="bg-red-600 text-white px-4 py-1 rounded text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;