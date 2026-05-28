import React from 'react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080C18',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '80px', fontWeight: 700, color: '#1E293B', lineHeight: 1 }}>404</div>
        <h2 style={{ color: '#F1F5F9', fontSize: '24px', margin: '10px 0 5px' }}>Page Not Found</h2>
        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '2rem' }}>
          The URL you entered does not exist.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: '#3B82F6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default NotFound;