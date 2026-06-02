import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const PageHeader = ({ title, subtitle, showBack = true, children }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const theme = {
    text: isDark ? '#F1F5F9' : '#1E293B',
    subText: isDark ? '#475569' : '#64748B',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {showBack && (
          <button 
            onClick={() => navigate(-1)} // -1 matlab actual pichla page
            style={{ 
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', 
              color: theme.text, borderRadius: '8px', padding: '7px 12px', 
              fontSize: '12px', cursor: 'pointer' 
            }}
          >
            ← Back
          </button>
        )}
        <div>
          <h1 style={{ color: theme.text, fontSize: '22px', fontWeight: 600, margin: 0, letterSpacing: '-0.3px' }}>
            {title}
          </h1>
          {subtitle && <p style={{ color: theme.subText, fontSize: '13px', marginTop: '4px' }}>{subtitle}</p>}
        </div>
      </div>
      
      {/* Yahan right side ka button aayega (jaise + New Allocation) */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
