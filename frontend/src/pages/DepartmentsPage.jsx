
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../utils/api';
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import Toast from "../components/Toast";
import { useTheme } from '../context/ThemeContext';

export default function DepartmentsPage() {
  const { isDark } = useTheme();
  const theme = { bg: isDark ? '#080C18' : '#F1F5F9', cardBg: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#1E293B', subText: isDark ? '#94A3B8' : '#64748B', border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' };
  const input = {
    background: isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.12)",
    borderRadius: "10px",
    padding: "10px 12px",
    color: theme.text,
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box",
    textTransform: 'capitalize',
  };
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const optionStyle = { background: isDark ? '#1E293B' : '#FFFFFF', color: theme.text };

  const [departments, setDepartments] = useState([]);
  
  const emptyForm = { dept_name: "", incharge_name: "", contact: "" };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(departments.length / itemsPerPage);
  const currentData = departments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const savedIncharges = [...new Set(
    departments
      .map(dept => dept.incharge_name)
      .filter(name => name && name.trim())
  )];

  const load = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/masters/departments`, { headers });
    setDepartments(res.data);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast({ message: "", type }), 3000);
  };

  useEffect(() => { 
    load(); 
  }, []);

  // const addDepartment = async (e) => {
  //   e.preventDefault();
  //   if (form.contact && form.contact.length !== 10) {
  //     alert("Contact number must be exactly 10 digits.");
  //     return;
  //   }
  //   await axios.post(`${API_BASE_URL}/api/masters/departments`, form, { headers });
  //   setForm({ dept_name: "", section_name: "", incharge_name: "", contact: "" });
  //   load();
  // };
  // Inside DepartmentsPage.jsx
const saveDepartment = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      dept_name: form.dept_name,
      contact: form.contact,
      incharge_name: form.incharge_name,
      status: 'active'
    };

    if (editingId) {
      await axios.put(`${API_BASE_URL}/api/masters/departments/${editingId}`, payload, { headers });
      showToast("Department updated successfully!");
    } else {
      await axios.post(`${API_BASE_URL}/api/masters/departments`, payload, { headers });
      showToast("Department added successfully!");
    }

    setForm(emptyForm);
    setEditingId(null);
    load();
  } catch (err) {
    showToast(err.response?.data?.message || "Error saving department", "error");
  }
};

  const toggleStatus = async (id, currentStatus) => {
    await axios.put(`${API_BASE_URL}/api/masters/departments/${id}/status`, { status: currentStatus === "active" ? "inactive" : "active" }, { headers });
    load();
  };

  const editDepartment = (department) => {
    setEditingId(department.id);
    setForm({
      dept_name: department.name || "",
      incharge_name: department.incharge_name || "",
      contact: department.contact || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.href = "/"; }} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: toast.type })} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        
        <PageHeader title="Department Management" subtitle="Admin can add/activate/deactivate departments" />

              <form onSubmit={saveDepartment} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr auto auto", gap: 10, margin: "16px 0" }}>
          <input style={input} placeholder="Department name" value={form.dept_name} onChange={(e) => setForm({ ...form, dept_name: e.target.value })} required />
          <select
            style={input}
            value={form.incharge_name}
            onChange={(e) => setForm({ ...form, incharge_name: e.target.value })}
          >
            <option value="" style={optionStyle}>No Incharge / Select Saved</option>
            {savedIncharges.map(name => (
              <option key={name} value={name} style={optionStyle}>{name}</option>
            ))}
          </select>

          <input style={input} type="tel" maxLength={10} placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value.replace(/[^0-9]/g, '') })} /> 
          <button type="submit" style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 600 }}>
            {editingId ? "Save" : "+ Add"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={{ background: "rgba(100,116,139,0.12)", color: theme.subText, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 600 }}>
              Cancel
            </button>
          )}
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
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => editDepartment(v)} style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#3B82F6", borderRadius: 10, padding: "6px 10px", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
                        Edit
                      </button>
                      <button onClick={() => toggleStatus(v.id, v.status)} style={{ background: v.status === "active" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${theme.border}`, color: v.status === "active" ? "#F87171" : "#34D399", borderRadius: 10, padding: "6px 10px", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
                        {v.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
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


