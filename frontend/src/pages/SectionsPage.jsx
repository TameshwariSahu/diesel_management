// import React, { useState, useEffect } from "react";
// import axios from "axios";
import { API_BASE_URL } from '../utils/api';
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import PageHeader from "../components/PageHeader";
// import { useTheme } from '../context/ThemeContext';

// const input = {
//   background: "#080C18",
//   border: "1px solid rgba(255,255,255,0.05)",
//   borderRadius: "8px",
//   padding: "10px 14px",
//   color: "#F1F5F9",
//   fontSize: "14px",
//   width: "100%",
//   height: "44px",
//   boxSizing: "border-box",
// };

// const select = { ...input, cursor: "pointer" };

// export default function SectionsPage() {
//   const navigate = useNavigate();
//   const { isDark } = useTheme();
//   const theme = { bg: isDark ? '#080C18' : '#F1F5F9', cardBg: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#1E293B', subText: isDark ? '#94A3B8' : '#64748B', border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' };
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const token = localStorage.getItem("token");
//   const headers = { Authorization: `Bearer ${token}` };

//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [form, setForm] = useState({ section_name: "", dept_id: "" });

//   const load = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/masters/sections`, { headers });
//       setSections(res.data);
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   };

//   const addSection = async (e) => {
//     e.preventDefault();
//     if (form.section_name && !form.dept_id) {
//       alert("Please fill all fields");
//       return;
//     }
//     try {
//       await axios.post(`${API_BASE_URL}/api/masters/sections`, form, { headers });
//       alert("Section added successfully!");
//       setForm({ section_name: "", dept_id: "" });
//       load();
//     } catch (err) {
//       alert(err.response?.data?.message || "Error adding section");
//     }
//   };

//   const toggleStatus = async (id, currentStatus) => {
//     await axios.put(`${API_BASE_URL}/api/masters/sections/${id}/status`, { status: currentStatus === "active" ? "inactive" : "active" }, { headers });
//     load();
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
//       <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.href = "/"; }} />
//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        
//         <PageHeader title="Section Management" subtitle="Manage organizational sections" />

//         <form onSubmit={addSection} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "20px" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 10 }}>
//             <input style={input} placeholder="Section Name (e.g., Local Route)" value={form.section_name} onChange={(e) => setForm({ ...form, section_name: e.target.value })} required />
//             <select style={select} value={form.dept_id} onChange={(e) => setForm({ ...form, dept_id: e.target.value })} required>
//               <option value="" style={{ background: '#1E293B' }}>Select Department</option>
//               <button type="submit" style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>+ Add</button>
//             </select>
//           </div>
//         </form>

//         <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden" }}>
//           <table style={{ width: "100%", borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
//                 {['Section Name', 'Department', 'Status', 'Action'].map(h => (
//                   <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>{h.toUpperCase()}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {sections.map(v => (
//                 <tr key={v.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
//                   <td style={{ padding: '12px 16px', color: theme.text, fontWeight: 600, fontSize: "13px" }}>{v.section_name}</td>
//                   <td style={{ padding: '12px 16px', color: theme.subText, fontSize: "13px" }}>{v.dept_name || "-"}</td>
//                   <td style={{ padding: '12px 16px', color: v.status === "active" ? "#34D399" : "#F87171", fontSize: "13px", fontWeight: 600 }}>{v.status}</td>
//                   <td style={{ padding: '12px 16px' }}>
//                     <button onClick={() => toggleStatus(v.id, v.status)} style={{ background: v.status === 'active' ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${theme.border}`, color: v.status === 'active' ? '#F87171' : '#34D399', borderRadius: 6, padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
//                       {v.status === 'active' ? 'Deactivate' : 'Activate'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import { useTheme } from '../context/ThemeContext';

export default function SectionsPage() {
  const { isDark } = useTheme();
  const theme = { 
    bg: isDark ? '#080C18' : '#F1F5F9', 
    cardBg: isDark ? '#0F172A' : '#FFFFFF', 
    text: isDark ? '#F1F5F9' : '#1E293B', 
    subText: isDark ? '#94A3B8' : '#64748B', 
    border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' 
  };
  const input = {
    background: isDark ? "#080C18" : "#FFFFFF",
    border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(15,23,42,0.12)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: theme.text,
    fontSize: "14px",
    width: "100%",
    height: "44px",
    boxSizing: "border-box",
  };
  const select = { ...input, cursor: "pointer" };
  const optionStyle = { background: isDark ? '#1E293B' : '#FFFFFF', color: theme.text };
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]); // NEW: State to hold departments

  const [form, setForm] = useState({ section_name: "", dept_id: "" });

  // Fetch both Sections and Departments on load
  const load = async () => {
    try {
      // Fetch Sections
      const secRes = await axios.get(`${API_BASE_URL}/api/masters/sections`, { headers });
      setSections(secRes.data);

      // Fetch Departments (for the dropdown)
      const deptRes = await axios.get(`${API_BASE_URL}/api/masters/departments`, { headers });
      setDepartments(deptRes.data.filter(dept => dept.status === 'active'));
    } catch (err) { 
      console.error(err); 
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addSection = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!form.section_name || !form.dept_id) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/masters/sections`, form, { headers });
      alert("Section added successfully!");
      setForm({ section_name: "", dept_id: "" });
      load(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Error adding section");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.href = "/"; }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        
        <PageHeader title="Section Management" subtitle="Manage organizational sections" />

        <form onSubmit={addSection} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 10, alignItems: "center" }}>
            
            {/* Section Name Input */}
            <input 
              style={input} 
              placeholder="Section Name (e.g., Local Route)" 
              value={form.section_name} 
              onChange={(e) => setForm({ ...form, section_name: e.target.value })} 
              required 
            />

            {/* Department Dropdown */}
            <select 
              style={select} 
              value={form.dept_id} 
              onChange={(e) => setForm({ ...form, dept_id: e.target.value })} 
              required
            >
              <option value="" style={optionStyle}>Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id} style={optionStyle}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Submit Button - MOVED OUTSIDE SELECT */}
            <button 
              type="submit" 
              style={{ 
                background: "#3B82F6", 
                color: "#fff", 
                border: "none", 
                borderRadius: 8, 
                padding: "0 20px", 
                height: "44px", // Match input height
                cursor: "pointer", 
                fontWeight: 600,
                whiteSpace: "nowrap"
              }}
            >
              + Add Section
            </button>

          </div>
        </form>

        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {['Section Name', 'Department'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map(v => (
                <tr key={v.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: '12px 16px', color: theme.text, fontWeight: 600, fontSize: "13px" }}>{v.section_name}</td>
                  <td style={{ padding: '12px 16px', color: theme.subText, fontSize: "13px" }}>{v.dept_name || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


