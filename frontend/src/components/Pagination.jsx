import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { isDark } = useTheme();
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '1.5rem', paddingBottom: '1rem' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          color: currentPage === 1 ? (isDark ? '#334155' : '#cbd5e1') : (isDark ? '#F1F5F9' : '#1e293b'),
          borderRadius: '6px', padding: '6px 14px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 500
        }}
      >
        Prev
      </button>
      <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '13px' }}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          color: currentPage === totalPages ? (isDark ? '#334155' : '#cbd5e1') : (isDark ? '#F1F5F9' : '#1e293b'),
          borderRadius: '6px', padding: '6px 14px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 500
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
