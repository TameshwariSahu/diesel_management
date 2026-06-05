import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
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
  const theme = { bg: isDark ? '#080C18' : '#F1F5F9', cardBg: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#1E293B', subText: isDark ? '#94A3B8' : '#64748B', border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' };
  
  const [allocations, setAllocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState({ message: "", type: "success" });
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
      const res = await axios.get(`${API_BASE_URL}/api/allocations`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: {
          page: currentPage,
          limit: 15,
          departmentId: departmentFilter || undefined,
          status: statusFilter || undefined,
        }
      });
      setAllocations(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/masters/departments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);
  useEffect(() => { fetchAll(); }, [currentPage, departmentFilter, statusFilter]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast({ message: "", type }), 3000);
  };

  const updateStatus = async (id, status) => {
    let change_reason;
    if (status === 'Rejected') {
      change_reason = window.prompt("Please enter rejection reason:");
      if (change_reason === null) return; 
    } else {
      change_reason = "Approved by Admin"; 
    }
    try {
      await axios.put(`${API_BASE_URL}/api/allocations/${id}/status`, { status, change_reason }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showToast(`Allocation ${status.toLowerCase()} successfully!`);
      fetchAll(); 
    } catch { showToast('Error updating status', 'error'); }
  };

  const exportPdf = () => {
    const escapeHtml = (value) => String(value ?? '-')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const selectedDepartment = departments.find(dept => String(dept.id) === String(departmentFilter));
    const reportTitle = selectedDepartment ? `${selectedDepartment.name} Allocation Report` : 'All Departments Allocation Report';
    const statusTitle = statusFilter || 'All Status';
    const rows = allocations.map(item => {
      const totalKm = item.opening_reading && item.closing_reading
        ? (parseFloat(item.closing_reading) - parseFloat(item.opening_reading)).toFixed(2)
        : '-';

      return `
        <tr>
          <td>${escapeHtml(formatDisplayDate(item.allocation_date))}</td>
          <td>${escapeHtml(item.department_name)}</td>
          <td>${escapeHtml(item.requested_by_name)}</td>
          <td>${escapeHtml(item.reg_no || item.vehicle_id)}</td>
          <td>${escapeHtml(totalKm)}</td>
          <td>${escapeHtml(item.authorized_by)}</td>
          <td>${escapeHtml(item.remarks)}</td>
          <td>${escapeHtml(item.status)}</td>
          <td>${escapeHtml(item.change_reason)}</td>
        </tr>
      `;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow popups to export PDF.', 'error');
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${escapeHtml(reportTitle)}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
            h1 { font-size: 20px; margin: 0 0 4px; }
            p { font-size: 12px; color: #4B5563; margin: 0 0 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #D1D5DB; padding: 7px 8px; text-align: left; vertical-align: top; }
            th { background: #EFF6FF; font-size: 10px; text-transform: uppercase; }
            @media print { body { margin: 12mm; } }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(reportTitle)}</h1>
          <p>Status: ${escapeHtml(statusTitle)} | Generated: ${escapeHtml(new Date().toLocaleString())}</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Department</th>
                <th>Requested By</th>
                <th>Vehicle</th>
                <th>Total (KM)</th>
                <th>Authorized By</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              ${rows || '<tr><td colspan="9">No allocation records found.</td></tr>'}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const navBtn = {
    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
    color: '#60A5FA', borderRadius: '8px', padding: '7px 14px',
    fontSize: '12px', fontWeight: 500, cursor: 'pointer',
  };
  const filterStyle = {
    background: isDark ? '#080C18' : '#FFFFFF',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.12)',
    color: theme.text,
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 12,
    outline: 'none',
    minWidth: 150,
  };
  const optionStyle = { background: isDark ? '#1E293B' : '#FFFFFF', color: theme.text };

  return (
    
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.replace('/'); }} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: toast.type })} />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <PageHeader title="Admin Dashboard" subtitle="Manage and review all diesel allocations" showBack={false}>
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
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ color: theme.text, fontSize: '15px', fontWeight: 600, margin: 0 }}>All Allocations</h2>
              <p style={{ color: theme.subText, fontSize: '12px', margin: '2px 0 0' }}>Review and approve requests</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select
                style={filterStyle}
                value={departmentFilter}
                onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="" style={optionStyle}>All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id} style={optionStyle}>{dept.name}</option>
                ))}
              </select>
              <select
                style={filterStyle}
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="" style={optionStyle}>All Status</option>
                <option value="Pending" style={optionStyle}>Pending</option>
                <option value="Approved" style={optionStyle}>Approved</option>
                <option value="Rejected" style={optionStyle}>Rejected</option>
              </select>
              <button onClick={() => { setCurrentPage(1); fetchAll(); }} style={navBtn}>↻ Refresh</button>
              <button onClick={exportPdf} style={navBtn}>Download PDF</button>
            </div>
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
                    {['Date', 'Department', 'Requested By', 'Vehicle', 'Total (KM)', 'Authorized By', 'Remarks', 'Status', 'Reason', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: theme.subText, fontSize: '11px', fontWeight: 600, letterSpacing: '0.4px' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allocations.map(item => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{formatDisplayDate(item.allocation_date)}</td>
                      <td style={{ padding: '12px 16px', color: theme.text, fontSize: '13px', fontWeight: 500 }}>{item.department_name || '-'}</td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.requested_by_name || '-'}</td>
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



