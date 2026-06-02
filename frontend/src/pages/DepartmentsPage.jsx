
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { useTheme } from '../context/ThemeContext';

const input = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  padding: "10px 12px",
  color: "#F1F5F9",
  fontSize: "13px",
  width: "100%",
  boxSizing: "border-box",
  textTransform: 'capitalize',
};

export default function DepartmentsPage() {
  const { isDark } = useTheme();
  const theme = { bg: isDark ? '#080C18' : '#F1F5F9', cardBg: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#1E293B', subText: isDark ? '#475569' : '#64748B', border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' };
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]); 
   const [showCustomIncharge, setShowCustomIncharge] = useState(false);
  
  const [form, setForm] = useState({ dept_name: "", incharge_id: "", contact: "" });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(departments.length / itemsPerPage);
  const currentData = departments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/api/masters/departments", { headers });
    setDepartments(res.data);
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/masters/users", { headers });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => { 
    load(); 
    loadUsers(); 
  }, []);

  // const addDepartment = async (e) => {
  //   e.preventDefault();
  //   if (form.contact && form.contact.length !== 10) {
  //     alert("Contact number must be exactly 10 digits.");
  //     return;
  //   }
  //   await axios.post("http://localhost:5000/api/masters/departments", form, { headers });
  //   setForm({ dept_name: "", section_name: "", incharge_name: "", contact: "" });
  //   load();
  // };
  // Inside DepartmentsPage.jsx
const addDepartment = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:5000/api/masters/departments", {
      dept_name: form.dept_name,
      contact: form.contact,
      incharge_id: form.incharge_id,
      status: 'active'
    }, { headers });
    alert("Department added successfully!");
    setForm({ dept_name: "", incharge_id: "", contact: "" });
    setShowCustomIncharge(false);
    load();
  } catch (err) {
    alert(err.response?.data?.message || "Error adding department");
  }
};

  const toggleStatus = async (id, currentStatus) => {
    await axios.put(`http://localhost:5000/api/masters/departments/${id}/status`, { status: currentStatus === "active" ? "inactive" : "active" }, { headers });
    load();
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.href = "/"; }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        
        <PageHeader title="Department Management" subtitle="Admin can add/activate/deactivate departments" />

              <form onSubmit={addDepartment} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr auto", gap: 10, margin: "16px 0" }}>
          <input style={input} placeholder="Department name" value={form.dept_name} onChange={(e) => setForm({ ...form, dept_name: e.target.value })} required />
                   {!showCustomIncharge ? (
            <select 
              style={input} 
              value={form.incharge_id} 
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setShowCustomIncharge(true);
                  setForm({ ...form, incharge_id: "" });
                } else {
                  setForm({ ...form, incharge_id: e.target.value });
                }
              }} 
              required
            >
              <option value="" style={{ background: '#1E293B' }}>Select Incharge</option>
             {users.map(u => (
                <option key={u.id} value={u.id} style={{ background: '#1E293B' }}>
                  ID: {u.id} - {u.name}
                </option>
              ))}
              <option value="custom" style={{ background: '#1E293B', color: '#F59E0B' }}>➕ Enter Custom ID</option>
            </select>
                 ) : (
            <div style={{ display: 'flex', gap: '5px' }}>
              <input 
                style={input} 
                placeholder="Employee ID" 
                value={form.incharge_id} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setForm({ ...form, incharge_id: val });
                  }
                }} 
                required 
              />
              <button 
                type="button" 
                onClick={() => { setShowCustomIncharge(false); setForm({ ...form, incharge_id: "" }); }}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171', borderRadius: 10, padding: '0 10px', cursor: 'pointer', fontSize: '16px' }}
                title="Back to Dropdown"
              >✕</button>
            </div>
          )}

          <input style={input} type="tel" maxLength={10} placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value.replace(/[^0-9]/g, '') })} /> 
          <button type="submit" style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 600 }}>+ Add</button>
        </form>

        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {["Name", "Incharge", "Contact", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map(v => (
                <tr key={v.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: "12px 16px", color: theme.text, fontWeight: 600, fontSize: "13px", textTransform: 'capitalize' }}>{v.name}</td>
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.incharge_name || "-"}</td>
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.contact || "-"}</td>
                  <td style={{ padding: "12px 16px", color: v.status === "active" ? "#34D399" : "#F87171", fontSize: "13px", fontWeight: 600 }}>{v.status}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => toggleStatus(v.id, v.status)} style={{ background: v.status === "active" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${theme.border}`, color: v.status === "active" ? "#F87171" : "#34D399", borderRadius: 10, padding: "6px 10px", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
                      {v.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </div>
      </div>
    </div>
  );
}
