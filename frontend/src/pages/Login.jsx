

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { sapId: username, password });
   
      console.log("Backend Response:", res.data);

      localStorage.setItem('token', res.data.token);
      
      const userRole = res.data.user?.role || 'department'; 
      localStorage.setItem('role', userRole);
    
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const targetPath = userRole === 'admin' ? '/admin' : '/department';
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
    } else if (token && role === 'department') {
      navigate('/department');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080C18',
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

      <div className="login-card" style={{
        background: '#0F172A',
        border: '1px solid rgba(59,130,246,0.15)',
        borderRadius: '20px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
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
            style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: 600, margin: 0, letterSpacing: '-0.5px' }}
          >
            Diesel Manager
          </h1>
          <p style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>
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
                   <div>
            <label style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', letterSpacing: '0.3px' }}>
              SAP ID
            </label>
            <input
              className="login-input"
              type="number" 
              placeholder="Enter your SAP ID"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '11px 14px',
                color: '#F1F5F9',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', letterSpacing: '0.3px' }}>
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
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '11px 14px',
                color: '#F1F5F9',
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

        <p style={{ color: '#334155', fontSize: '12px', textAlign: 'center', marginTop: '1.5rem' }}>
          Demo: admin / password
        </p>
      </div>
    </div>
  );
};

export default Login;

