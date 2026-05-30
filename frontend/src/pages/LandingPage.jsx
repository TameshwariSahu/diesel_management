

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const theme = {
    bg: isDark ? '#080C18' : '#F1F5F9',
    text: isDark ? '#F1F5F9' : '#1e293b',
    subText: isDark ? '#94A3B8' : '#64748B',
    cardBg: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.8)',
    btnAdmin: {
      background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 28px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 10px 25px rgba(59,130,246, 0.3)', transition: 'all 0.2s'
    },
    btnDept: {
      background: 'transparent', color: '#3B82F6', border: '2px solid #3B82F6', borderRadius: '12px', padding: '14px 28px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
    }
  };

  // ✅ Logo click logic (Agar login hai toh dashboard pe bhejo)
  const handleLogoClick = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'admin') navigate('/admin');
    else if (token && role === 'department') navigate('/department');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontFamily: "'DM Sans', sans-serif",
      padding: '2rem'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        
        {/* ✅ Logo Section - onClick add kiya */}
        <div
          onClick={handleLogoClick}
          style={{
            width: '120px', height: '120px',
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            borderRadius: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '60px',
            boxShadow: '0 20px 40px rgba(59,130,246, 0.4)',
            marginBottom: '2rem',
            cursor: 'pointer'
          }}
        >
          ⛽
        </div>

        <h1 style={{ color: theme.text, fontSize: '42px', fontWeight: 700, margin: 0, letterSpacing: '-1px' }}>
          Diesel Manager
        </h1>
        <p style={{ color: theme.subText, fontSize: '18px', marginTop: '8px', marginBottom: '3rem' }}>
          Fleet Fuel System
        </p>

        {/* Buttons Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
          <button 
            onClick={() => navigate('/login')}
            style={theme.btnAdmin}
            onMouseEnter={(e) => { e.target.style.background = '#2563EB'; }}
            onMouseLeave={(e) => { e.target.style.background = '#3B82F6'; }}
          >
            Login as Admin
          </button>

          <button 
            onClick={() => navigate('/login')}
            style={theme.btnDept}
            onMouseEnter={(e) => { e.target.style.background = '#EFF6FF'; e.target.style.color = '#2563EB'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#3B82F6'; }}
          >
            Login as Department
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;