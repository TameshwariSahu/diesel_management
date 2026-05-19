import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import NewAllocation from './NewAllocation';

const DeptDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/allocations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllocations(res.data);
    } catch (err) {
      console.error(err);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Department Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            {showForm ? 'Close Form' : '+ New Diesel Allocation'}
          </button>
        </div>

        {showForm && <NewAllocation />}

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Allocations</h2>
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
                </tr>
              </thead>
              <tbody>
                {allocations.length > 0 ? (
                  allocations.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{item.allocation_date}</td>
                      <td className="p-3 font-medium">{item.vehicle_reg_no}</td>
                      <td className="p-3">{item.opening_balance}</td>
                      <td className="p-3 text-blue-600 font-medium">{item.allocated_diesel}</td>
                      <td className="p-3">{item.closing_balance}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${item.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                            item.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeptDashboard;