import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">⛽</div>
          <div>
            <h1 className="text-xl font-semibold">Diesel Management</h1>
            <p className="text-xs text-blue-200">Vehicle Fuel System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{user?.full_name || user?.username}</p>
            <p className="text-sm text-blue-200 capitalize">{user?.role}</p>
          </div>
          <button 
            onClick={onLogout}
            className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;