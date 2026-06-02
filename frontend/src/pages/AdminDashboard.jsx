import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import { useTheme } from '../context/ThemeContext';
import { formatDisplayDate } from '../utils/date';


const StatusBadge = ({ status }) => {
  const styles = {
    Approved: { bg: 'rgba(16,185,129,0.1)', color: '#34D399', border: 'rgba(16,185,129,0.2)' },
    Rejected: { bg: 'rgba(239,68,68,0.1)', color: '#F87171', border: 'rgba(239,68,68,0.2)' },
    Pending:  { bg: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: 'rgba(245,158,11,0.2)' },
  };
  const s = styles[status] || styles.Pending;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, }}>{status}</span>
  );
};

const StatCard = ({ label, value, color, icon, theme }) => (
  <div style={{ background: theme.cardBg, border: `1px solid ${color}22`, borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, }}>{icon}</div>
    <div>
      <div style={{ color: theme.subText, fontSize: '11px', fontWeight: 500 }}>{label}</div>
      <div style={{ color: theme.text, fontSize: '26px', fontWeight: 600, lineHeight: 1.2 }}>{value}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { isDark } = useTheme();
  const theme = { bg: isDark ? '#080C18' : '#F1F5F9', cardBg: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#1E293B', subText: isDark ? '#475569' : '#64748B', border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' };
  
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const stats = {
    total: allocations.length,
    pending: allocations.filter(a => a.status === 'Pending').length,
    approved: allocations.filter(a => a.status === 'Approved').length,
    rejected: allocations.filter(a => a.status === 'Rejected').length,
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/allocations', { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { page: currentPage } 
      });
      setAllocations(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [currentPage]);

  const updateStatus = async (id, status) => {
    let change_reason;
    if (status === 'Rejected') {
      change_reason = window.prompt("Please enter rejection reason:");
      if (change_reason === null) return; 
    } else {
      change_reason = "Approved by Admin"; 
    }
    try {
      await axios.put(`http://localhost:5000/api/allocations/${id}/status`, { status, change_reason }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAll(); 
    } catch { alert('Error updating status'); }
  };

  const navBtn = {
    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
    color: '#60A5FA', borderRadius: '8px', padding: '7px 14px',
    fontSize: '12px', fontWeight: 500, cursor: 'pointer',
  };

  return (
    
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.replace('/'); }} />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <PageHeader title="Admin Dashboard" subtitle="Manage and review all diesel allocations">
          <button style={navBtn} onClick={() => navigate('/admin/vehicles')}>Vehicles</button>
          <button style={navBtn} onClick={() => navigate('/admin/sections')}>Sections</button>
          <button style={navBtn} onClick={() => navigate('/admin/departments')}>Departments</button>
              <button style={navBtn} onClick={() => navigate('/admin/employees')}>Employees</button>
          
        </PageHeader>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          <StatCard label="TOTAL" value={stats.total} color="#3B82F6" icon="📊" theme={theme} />
          <StatCard label="PENDING" value={stats.pending} color="#F59E0B" icon="⏳" theme={theme} />
          <StatCard label="APPROVED" value={stats.approved} color="#10B981" icon="✅" theme={theme} />
          <StatCard label="REJECTED" value={stats.rejected} color="#EF4444" icon="❌" theme={theme} />
        </div>

        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ color: theme.text, fontSize: '15px', fontWeight: 600, margin: 0 }}>All Allocations</h2>
              <p style={{ color: theme.subText, fontSize: '12px', margin: '2px 0 0' }}>Review and approve requests</p>
            </div>
            <button onClick={() => { setCurrentPage(1); fetchAll(); }} style={navBtn}>↻ Refresh</button>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: theme.subText, fontSize: '13px' }}>Loading...</div>
          ) : allocations.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: theme.subText, fontSize: '13px' }}>No allocations found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    {['Date', 'Vehicle', 'Total (KM)', 'Authorized By', 'Remarks', 'Status', 'Reason', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: theme.subText, fontSize: '11px', fontWeight: 600, letterSpacing: '0.4px' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allocations.map(item => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{formatDisplayDate(item.allocation_date)}</td>
                      <td style={{ padding: '12px 16px', color: theme.text, fontSize: '13px', fontWeight: 500 }}>{item.reg_no || item.vehicle_id}</td>
                      <td style={{ padding: '12px 16px', color: theme.text, fontSize: '13px', fontWeight: 500 }}>
                      {(item.opening_reading && item.closing_reading) 
  ? (parseFloat(item.closing_reading) - parseFloat(item.opening_reading)).toFixed(2) 
  : '-'}  {/* {item.closing_reading && item.opening_reading ? ((Number(item.closing_reading) - Number(item.opening_reading)).toFixed(2)) : '-'} */}
                      </td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.authorized_by || '-'}</td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.remarks || '-'}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={item.status} /></td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.change_reason || '-'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {item.status === 'Pending' && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => updateStatus(item.id, 'Approved')} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>✓ Approve</button>
                            <button onClick={() => updateStatus(item.id, 'Rejected')} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>✕ Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

