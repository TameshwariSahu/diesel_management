import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  
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

export default function VehiclesPage() {
  const navigate = useNavigate();  
  const { isDark } = useTheme();
  const theme = { bg: isDark ? '#080C18' : '#F1F5F9', cardBg: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#1E293B', subText: isDark ? '#475569' : '#64748B', border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' };
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [vehicles, setVehicles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ reg_no: "", vehicle_type: "", department_id: "", driver_name: "", tank_capacity: "" });
  const [message, setMessage] = useState('');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    try {
      const dRes = await axios.get("http://localhost:5000/api/masters/departments", { headers });
      setDepartments(dRes.data);

      const vRes = await axios.get("http://localhost:5000/api/masters/vehicles", { 
        headers, 
        params: { page: currentPage } 
      });
      
      setVehicles(vRes.data.data);
      setTotalPages(vRes.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [currentPage]);

  const addVehicle = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post("http://localhost:5000/api/masters/vehicles", {
        ...form,
        department_id: Number(form.department_id),
        tank_capacity: form.tank_capacity ? Number(form.tank_capacity) : null,
      }, { headers });
      setMessage('success');
      setForm({ reg_no: "", vehicle_type: "", department_id: "", driver_name: "", tank_capacity: "" });
      load();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error adding vehicle";
      setMessage(errorMsg);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    await axios.put(`http://localhost:5000/api/masters/vehicles/${id}/status`, { status: currentStatus === "active" ? "inactive" : "active" }, { headers });
    load();
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.href = "/"; }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <PageHeader title="Vehicle Management" subtitle="Admin can add/activate/deactivate vehicles" />

        {message === 'success' && (
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '10px 14px', color: '#34D399', fontSize: '13px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Vehicle added successfully</div>
        )}
        {message && message !== 'success' && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', color: '#F87171', fontSize: '13px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>⚠ {message}</div>
        )}

        <form onSubmit={addVehicle} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr auto", gap: 10, margin: "16px 0" }}>
          <input style={{ ...input, textTransform: 'uppercase' }} placeholder="Reg No" value={form.reg_no}onChange={(e) => setForm({ ...form, reg_no: e.target.value.toUpperCase() })}  />
          <select style={input} value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })} required>
            <option value="">Select Type</option>
            <option value="Car">Car</option>
            <option value="Hired Vehicle">Hired Vehicle</option>
            <option value="Tempo">Tempo</option>
            <option value="Truck">Truck</option>
            <option value="Bus">Bus</option>
          </select>
          <select style={input} value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} required>
            <option value="">Department</option>
            {departments.filter(d => d.status === "active").map(d => (<option key={d.id} value={d.id}>{d.dept_name}</option>))}
          </select>
          <input style={input} placeholder="Driver" value={form.driver_name} onChange={(e) => setForm({ ...form, driver_name: e.target.value })} />
          <input style={input} placeholder="Tank capacity" value={form.tank_capacity} onChange={(e) => setForm({ ...form, tank_capacity: e.target.value })} />
          <button type="submit" style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 600 }}>+ Add</button>
        </form>

        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {["Reg No", "Type", "Department", "Driver", "Capacity", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: "12px 16px", color: theme.text, fontWeight: 600, fontSize: "13px" }}>{v.reg_no}</td>
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.vehicle_type || "-"}</td>
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px", textTransform: 'capitalize' }}>{v.dept_name || v.department_id}</td>
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px", textTransform: 'capitalize' }}>{v.driver_name || "-"}</td>
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.tank_capacity || "-"}</td>
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


