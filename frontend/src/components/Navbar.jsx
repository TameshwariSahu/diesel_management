import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-xl">⛽</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Diesel Manager</h1>
            <p className="text-xs text-slate-400">Fleet Fuel System</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="font-semibold text-white">{user?.full_name || user?.username}</p>
            <p className="text-xs text-slate-400 capitalize font-medium">
              {user?.role === 'admin' ? '👤 Administrator' : '🏢 Department'}
            </p>
          </div>
          <button 
            onClick={onLogout}
            className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 transform hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
