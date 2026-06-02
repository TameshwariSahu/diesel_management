import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import NewAllocation from './NewAllocation';
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

const DeptDashboard = () => {
  const { isDark } = useTheme();
  const theme = { bg: isDark ? '#080C18' : '#F1F5F9', cardBg: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#1E293B', subText: isDark ? '#475569' : '#64748B', border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' };
  
  const [allocations, setAllocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deptName, setDeptName] = useState('Loading...'); 
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const fetchAllocations = async () => {
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

  const fetchDepartmentName = async () => {
    if (user.department_id) {
      try {
        const res = await axios.get('http://localhost:5000/api/masters/departments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const dept = res.data.find(d => d.id == user.department_id);
        setDeptName(dept ? dept.name : 'Unknown Department');
      } catch { setDeptName('Error'); }
    }
  };

  useEffect(() => { fetchAllocations(); fetchDepartmentName(); }, [currentPage]);

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      {/* <Navbar user={user} deptName={deptName} onLogout={() => { localStorage.clear(); window.location.href = '/'; }} /> */}
     <Navbar user={user} deptName={deptName} onLogout={() => { localStorage.clear(); window.location.replace('/'); }} />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        <PageHeader title={`${deptName} Dashboard`} subtitle="Manage your diesel allocation requests">
          <button onClick={() => setShowForm(!showForm)} style={{ background: showForm ? 'rgba(239,68,68,0.1)' : '#3B82F6', border: showForm ? '1px solid rgba(239,68,68,0.2)' : 'none', color: showForm ? '#F87171' : '#fff', borderRadius: '10px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            {showForm ? '✕ Close' : '+ New Allocation'}
          </button>
        </PageHeader>

        {showForm && (
          <div style={{ marginBottom: '1.75rem' }}>
            <NewAllocation onSuccess={() => { setShowForm(false); fetchAllocations(); }} />
          </div>
        )}

        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}` }}>
            <h2 style={{ color: theme.text, fontSize: '15px', fontWeight: 600, margin: 0 }}>Your Allocations</h2>
            <p style={{ color: theme.subText, fontSize: '12px', margin: '2px 0 0' }}>{allocations.length} total requests</p>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: theme.subText, fontSize: '13px' }}>Loading...</div>
          ) : allocations.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: theme.subText, fontSize: '14px' }}>No allocations yet</p>
              <p style={{ color: theme.subText, fontSize: '12px', marginTop: '4px' }}>Create your first allocation request</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    {['Date', 'Vehicle', 'Total (KM)', 'Authorized By', 'Remarks', 'Status', 'Reason'].map(h => (
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
                        {item.closing_reading && item.opening_reading ? ((Number(item.closing_reading) - Number(item.opening_reading)).toFixed(2)) : '-'}
                      </td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.authorized_by || '-'}</td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.remarks || '-'}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={item.status} /></td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.change_reason || '-'}</td>
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

export default DeptDashboard;
