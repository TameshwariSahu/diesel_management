import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../utils/api';
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { useTheme } from '../context/ThemeContext';
import { formatDisplayDate } from '../utils/date';

const StatusBadge = ({ status }) => {
  const styles = {
    active: { bg: 'rgba(16,185,129,0.1)', color: '#34D399', border: 'rgba(16,185,129,0.2)' },
    inactive: { bg: 'rgba(239,68,68,0.1)', color: '#F87171', border: 'rgba(239,68,68,0.2)' },
  };
  const s = styles[status] || styles.active;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, }}>{status}</span>
  );
};

export default function VehiclesPage() {
  const { isDark } = useTheme();
  const theme = { bg: isDark ? '#080C18' : '#F1F5F9', cardBg: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#1E293B', subText: isDark ? '#94A3B8' : '#64748B', border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' };
  const input = {
    background: isDark ? "#080C18" : "#FFFFFF",
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.12)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: theme.text,
    fontSize: "14px",
    width: "100%",
    height: "44px",
    boxSizing: "border-box",
    outline: "none",
  };
  const select = {
    ...input,
    cursor: "pointer",
  };
  const optionStyle = { background: isDark ? '#1E293B' : '#FFFFFF', color: theme.text };
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [vehicles, setVehicles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ reg_no: "", vehicle_type: "", department_id: "", section_id: "", driver_name: "", tank_capacity: "" });

  const toggleStatus = async (id, currentStatus) => {
    await axios.put(`${API_BASE_URL}/api/masters/vehicles/${id}/status`, { status: currentStatus === "active" ? "inactive" : "active" }, { headers });
    load(); 
  };

  const addVehicle = async (e) => {
    e.preventDefault();
    if (form.reg_no && form.reg_no.length > 15) {
      alert("Registration No is too long.");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/masters/vehicles`, form, { headers });
      alert("Vehicle added successfully!");
      setShowForm(false);
      setForm({ reg_no: "", vehicle_type: "", department_id: "", section_id: "", driver_name: "", tank_capacity: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding vehicle');
    }
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/masters/vehicles`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { page: currentPage } 
      });
      setVehicles(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/masters/departments`, { headers });
      setDepartments(res.data.filter(d => d.status === 'active'));
    } catch (err) { console.error(err); }
  };

  const loadSections = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/masters/sections`, { headers });
      setSections(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, [currentPage]);
  useEffect(() => { loadDepartments(); loadSections(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.href = "/"; }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        
        <PageHeader title="Vehicle Management" subtitle="Add and manage system vehicles">
          <button 
            onClick={() => setShowForm(!showForm)} 
            style={{ 
              background: showForm ? 'rgba(239,68,68,0.1)' : '#3B82F6', 
              border: showForm ? '1px solid rgba(239,68,68,0.2)' : 'none', 
              color: showForm ? '#F87171' : '#fff', 
              borderRadius: 10, 
              padding: '9px 20px', 
              fontSize: '13px', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            {showForm ? '✕ Close' : '+ New Vehicle'}
          </button>
        </PageHeader>

        {/* ✅ Add Vehicle Form (Hidden by default) */}
        {showForm && (
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "1.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <form onSubmit={addVehicle} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h2 style={{ color: theme.text, fontSize: '15px', fontWeight: 600, marginBottom: 20 }}>Add New Vehicle</h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ color: theme.subText, fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>REGISTRATION NO</label>
                    <input style={input} placeholder="CG04AB1234" value={form.reg_no} onChange={(e) => setForm({ ...form, reg_no: e.target.value.toUpperCase() })} required />
                  </div>
                 <div>
                  <label style={{ color: theme.subText, fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>TYPE</label>
                  <select style={select} value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })} required>
                    <option value="" style={optionStyle}>Select Type</option>
                    <option value="Truck" style={optionStyle}>Truck</option>
                    <option value="Car" style={optionStyle}>Car</option>
                    <option value="Hired Vehicle" style={optionStyle}>Hired Vehicle</option>
                  </select>
                </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ color: theme.subText, fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>DEPARTMENT</label>
                    <select
                      style={select}
                      value={form.department_id}
                      onChange={(e) => setForm({ ...form, department_id: e.target.value, section_id: "" })}
                      required
                    >
                      <option value="" style={optionStyle}>Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id} style={optionStyle}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: theme.subText, fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>SECTION</label>
                    <select
                      style={{ ...select, opacity: form.department_id ? 1 : 0.65 }}
                      value={form.section_id}
                      onChange={(e) => setForm({ ...form, section_id: e.target.value })}
                      disabled={!form.department_id}
                    >
                      <option value="" style={optionStyle}>
                        {form.department_id ? "Select Section" : "Select Department First"}
                      </option>
                      {sections
                        .filter(section => String(section.dept_id) === String(form.department_id))
                        .map(section => (
                          <option key={section.id} value={section.id} style={optionStyle}>{section.section_name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ color: theme.subText, fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>DRIVER NAME</label>
                    <input style={input} placeholder="Driver Name" value={form.driver_name} onChange={(e) => setForm({ ...form, driver_name: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ color: theme.subText, fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>TANK CAPACITY</label>
                    <input style={input} type="number" placeholder="e.g., 100.00" value={form.tank_capacity} onChange={(e) => setForm({ ...form, tank_capacity: e.target.value })} required />
                  </div>
                </div>

                <button type="submit" style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, padding: "12px", cursor: "pointer", fontWeight: 600 }}>+ Add Vehicle</button>
              </form>
            </div>
          </div>
        )}

        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}` }}>
            <div>
              <h2 style={{ color: theme.text, fontSize: '15px', fontWeight: 600, margin: 0 }}>All Vehicles</h2>
              <p style={{ color: theme.subText, fontSize: '12px', margin: '2px 0 0' }}>Manage and review vehicles</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: theme.subText, fontSize: "13px" }}>Loading...</div>
          ) : vehicles.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: theme.subText, fontSize: "13px" }}>No vehicles found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: "100%", borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    {['Date', 'Vehicle', 'Type', 'Department', 'Section', 'Driver', 'Capacity', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(item => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '12px 16px', color: theme.text, fontSize: '13px' }}>{formatDisplayDate(item.created_at)}</td>
                      <td style={{ padding: '12px 16px', color: theme.text, fontSize: '13px', fontWeight: 500 }}>{item.reg_no || item.vehicle_id}</td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.vehicle_type || '-'}</td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.dept_name || '-'}</td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.section_name || '-'}</td>
                      <td style={{ padding: '12px 16px', color: theme.subText, fontSize: '13px' }}>{item.driver_name || '-'}</td>
                      <td style={{ padding: '12px 16px', color: theme.text, fontSize: '13px' }}>{item.tank_capacity || '-'}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={item.status} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        <button 
                          onClick={() => toggleStatus(item.id, item.status)} 
                          style={{ 
                            background: item.status === 'active' ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", 
                            border: `1px solid ${theme.border}`, 
                            color: item.status === 'active' ? '#F87171' : '#34D399', 
                            borderRadius: 6, 
                            padding: '4px 10px', 
                            fontSize: '11px', 
                            fontWeight: 600, 
                            cursor: 'pointer' 
                          }}
                        >
                          {item.status === 'active' ? '✕ Deactivate' : '✕ Activate'}
                        </button>
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
}


