

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
      background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 20px rgba(59,130,246, 0.28)', transition: 'all 0.2s'
    },
    btnDept: {
      background: 'transparent', color: '#3B82F6', border: '1.5px solid #3B82F6', borderRadius: '10px', padding: '11px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
    }
  };

  // ✅ Logo click logic (Agar login hai toh dashboard pe bhejo)
  const handleLogoClick = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'admin') navigate('/admin');
    else if (token && role) navigate('/department');
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
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px' }}>
        
        {/* ✅ Logo Section - onClick add kiya */}
        <div
          onClick={handleLogoClick}
          style={{
            width: '84px', height: '84px',
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            borderRadius: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px',
            boxShadow: '0 14px 30px rgba(59,130,246, 0.35)',
            margin: '0 auto 1.35rem',
            cursor: 'pointer'
          }}
        >
          ⛽
        </div>

        <h1 style={{ color: theme.text, fontSize: '30px', fontWeight: 700, margin: 0, lineHeight: 1.18 }}>
          Diesel Management System
        </h1>
        <p style={{ color: theme.subText, fontSize: '15px', marginTop: '7px', marginBottom: '2rem' }}>
          Fuel Allocation System
        </p>

        {/* Buttons Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', width: '100%' }}>
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
