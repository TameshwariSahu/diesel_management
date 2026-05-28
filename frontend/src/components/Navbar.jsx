
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ user, onLogout, deptName }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // ✅ Logo click karne ka naya function
  const handleLogoClick = () => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'department') {
      navigate('/department');
    } else {
      navigate('/');
    }
  };

  return (
    <nav style={{
      background: '#0A0F1E',
      borderBottom: '1px solid rgba(59,130,246,0.15)',
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* ✅ Yahan onClick aur cursor: pointer add kiya */}
      <div 
        onClick={handleLogoClick} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          cursor: 'pointer' 
        }}
      >
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px'
        }}>⛽</div>
        <div>
          <div style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '15px', letterSpacing: '-0.3px' }}>
            Diesel Manager
          </div>
          <div style={{ color: '#64748B', fontSize: '11px' }}>Fleet Fuel System</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#F1F5F9', fontSize: '13px', fontWeight: 500 }}>
            {user?.full_name || user?.username}
          </div>
          <div style={{ color: '#3B82F6', fontSize: '11px', textTransform: 'capitalize' }}>
            {user?.role === 'admin' ? 'Administrator' : (deptName || 'Department')}
          </div>
        </div>  
        <button
          onClick={onLogout}
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#F87171',
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.2)'}
          onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
        >
          Logout
        </button>
        <button
          onClick={toggleTheme}
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '8px',
            width: '35px',
            height: '35px',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? '🌞' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;