

import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState('employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const theme = {
    bg: isDark ? '#080C18' : '#F1F5F9',
    cardBg: isDark ? '#0F172A' : '#FFFFFF',
    text: isDark ? '#F1F5F9' : '#1E293B',
    subText: isDark ? '#94A3B8' : '#64748B',
    mutedText: isDark ? '#334155' : '#94A3B8',
    border: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(15,23,42,0.08)',
    inputBg: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
    inputBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.12)',
    shadow: isDark ? '0 25px 50px rgba(0,0,0,0.5)' : '0 25px 50px rgba(15,23,42,0.12)',
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');
  //   try {
  //     const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { sapId: username, password });
   
  //     console.log("Backend Response:", res.data);

  //     localStorage.setItem('token', res.data.token);
   
  //     const userRole = res.data.user.role; 

  //     console.log("Role received from backend:", userRole); 
  //     localStorage.setItem('role', userRole);
    
  //     localStorage.setItem('user', JSON.stringify(res.data.user));

  //     const targetPath = userRole === 'admin' ? '/admin' : '/department';
  //     window.location.href = targetPath;
      
  //   } catch (err) {
  //     console.error("Login Error:", err); 
  //     setError(err.response?.data?.message || 'Login failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!/^\d{8}$/.test(username)) {
      setError('SAP ID must be exactly 8 digits.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
        sapId: username, 
        password: password,
        expectedRole: loginRole
      });
   
      console.log("FULL BACKEND RESPONSE:", res.data);

      // ✅ EXPLICITLY get the role from the response
      const backendRole = res.data.user.role;
      console.log("Extracted Role for Routing:", backendRole);

      if (backendRole !== loginRole) {
        setError(loginRole === 'admin'
          ? 'These credentials are not allowed for admin login.'
          : 'These credentials are not allowed for department login.'
        );
        return;
      }

      // ✅ FIX: Directly check the role. No defaults.
      const targetPath = backendRole === 'admin' ? '/admin' : '/department';
      
      console.log("Redirecting to:", targetPath);

      // ✅ Clear old storage to be safe
      localStorage.clear();

      // Save new data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', backendRole); // Save the specific role we checked
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // ✅ Force redirect
      window.location.href = targetPath;
      
    } catch (err) {
      console.error("Login Error:", err); 
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  const handleLogoClick = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'admin') {
      navigate('/admin');
    } else if (token && role) {
      navigate('/department');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#080C18' : 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: '1rem',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .login-card { animation: fadeUp 0.4s ease; }
        .login-input { transition: border-color 0.15s, box-shadow 0.15s; }
        .login-input:focus { outline: none; border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        .login-btn:hover:not(:disabled) { background: #2563EB !important; transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0) !important; }
        .logo-click { cursor: pointer; transition: opacity 0.15s; }
        .logo-click:hover { opacity: 0.8; }
      `}</style>

      <button
        type="button"
        onClick={toggleTheme}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 42,
          height: 42,
          borderRadius: 10,
          border: theme.border,
          background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)',
          color: theme.text,
          cursor: 'pointer',
          fontSize: 18,
          boxShadow: isDark ? 'none' : '0 8px 20px rgba(15,23,42,0.08)',
        }}
      >
        {isDark ? '🌞' : '🌙'}
      </button>

      <div className="login-card" style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '20px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: theme.shadow,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
       
          <div 
            className="logo-click"
            onClick={handleLogoClick}
            style={{
              width: '56px', height: '56px',
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', margin: '0 auto 1rem',
              boxShadow: '0 8px 20px rgba(59,130,246,0.3)',
            }}>⛽</div>
          <h1 
            className="logo-click"
            onClick={handleLogoClick}
            style={{ color: theme.text, fontSize: '24px', fontWeight: 600, margin: 0, letterSpacing: '-0.5px' }}
          >
            Diesel Management System
          </h1>
          <p style={{ color: theme.subText, fontSize: '13px', marginTop: '4px' }}>
            Vehicle Fuel Management System
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#F87171',
            fontSize: '13px',
            marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { value: 'employee', label: 'Employee' },
              { value: 'admin', label: 'Admin' },
            ].map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLoginRole(option.value)}
                style={{
                  background: loginRole === option.value ? '#3B82F6' : (isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC'),
                  border: loginRole === option.value ? '1px solid #3B82F6' : `1px solid ${theme.inputBorder}`,
                  color: loginRole === option.value ? '#FFFFFF' : theme.text,
                  borderRadius: 10,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
           <div>
            <label style={{ color: theme.subText, fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', letterSpacing: '0.3px' }}>
              SAP ID
            </label>
            <input
              className="login-input"
              type="text" 
              inputMode="numeric"
              placeholder="Enter 8-digit SAP ID"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/\D/g, '').slice(0, 8))}
              required
              style={{
                width: '100%', boxSizing: 'border-box',
                background: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`,
                borderRadius: '10px',
                padding: '11px 14px',
                color: theme.text,
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ color: theme.subText, fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', letterSpacing: '0.3px' }}>
              PASSWORD
            </label>
            <input
              className="login-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', boxSizing: 'border-box',
                background: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`,
                borderRadius: '10px',
                padding: '11px 14px',
                color: theme.text,
                fontSize: '14px',
              }}
            />
          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
            style={{
              background: '#3B82F6',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '4px',
              transition: 'all 0.15s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ color: theme.mutedText, fontSize: '12px', textAlign: 'center', marginTop: '1.5rem' }}>
          Demo: admin / password
        </p>
      </div>
    </div>
  );
};

export default Login;



