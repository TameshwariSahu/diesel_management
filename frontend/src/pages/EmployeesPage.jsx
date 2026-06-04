// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
import { API_BASE_URL } from '../utils/api';
// // import { useNavigate } from "react-router-dom";
// // import Navbar from "../components/Navbar";
// // import PageHeader from "../components/PageHeader";
// // import Pagination from "../components/Pagination";
// // import { useTheme } from '../context/ThemeContext';

// // const input = {
// //   background: "rgba(255,255,255,0.04)",
// //   border: "1px solid rgba(255,255,255,0.08)",
// //   borderRadius: "8px",
// //   padding: "10px 14px", 
// //   color: "#F1F5F9",
// //   fontSize: "14px",
// //   width: "100%",
// //   height: "44px",
// //   boxSizing: "border-box",
// //   outline: "none",
// //   transition: "all 0.15s",
// // };

// // input[':focus'] = {
// //   borderColor: "#3B82F6",
// //   boxShadow: "0 0 0 3px rgba(59,130,246,0.1)"
// // };

// // const inputFocus = "border-color: #3B82F6;";

// // const select = {
// //   ...input,
// //   cursor: "pointer",
// // };

// // export default function EmployeesPage() {
// //   const navigate = useNavigate();
// //   const { isDark } = useTheme();
// //   const theme = { 
// //     bg: isDark ? '#080C18' : '#F1F5F9', 
// //     cardBg: isDark ? '#0F172A' : '#FFFFFF', 
// //     text: isDark ? '#F1F5F9' : '#1E293B', 
// //     subText: isDark ? '#94A3B8' : '#64748B', 
// //     border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' 
// //   };
// //   const user = JSON.parse(localStorage.getItem("user") || "{}");
// //   const token = localStorage.getItem("token");
// //   const headers = { Authorization: `Bearer ${token}` };

// //   const [employees, setEmployees] = useState([]);
// //   const [departments, setDepartments] = useState([]);
// //   const [sections, setSections] = useState([]);
  
// //   const [form, setForm] = useState({ 
// //     name: "", 
// //     sapId: "", 
// //     password: "", 
// //     role: "employee", 
// //     deptId: "", 
// //     sectionId: "", 
// //     contact: "" 
// //   });

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 5;
// //   const totalPages = Math.ceil(employees.length / itemsPerPage);
// //   const currentData = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

// //   const load = async () => {
// //     try {
// //       const res = await axios.get(`${API_BASE_URL}/api/masters/employees`, { headers });
// //       setEmployees(res.data);
// //     } catch (err) { console.error(err); }
// //   };

// //   const loadDepartments = async () => {
// //     try {
// //       const res = await axios.get(`${API_BASE_URL}/api/masters/departments`, { headers });
// //       setDepartments(res.data);
// //     } catch (err) { console.error(err); }
// //   };

// //   const loadSections = async () => {
// //     try {
// //       const res = await axios.get(`${API_BASE_URL}/api/masters/sections`, { headers });
// //       setSections(res.data);
// //     } catch (err) { console.error(err); }
// //   };

// //   useEffect(() => { 
// //     load(); 
// //     loadDepartments();
// //     loadSections();
// //   }, []);

// //   const addEmployee = async (e) => {
// //     e.preventDefault();
// //     if (form.sapId.length !== 7) {
// //       alert("SAP ID must be exactly 7 digits.");
// //       return;
// //     }
// //     try {
// //       await axios.post(`${API_BASE_URL}/api/masters/employees`, form, { headers });
// //       alert("Employee added successfully!");
// //       setForm({ name: "", sapId: "", password: "", role: "employee", deptId: "", sectionId: "", contact: "" });
// //       load();
// //     } catch (err) {
// //       alert(err.response?.data?.message || "Error adding employee");
// //     }
// //   };

// //   return (
// //     <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
// //       <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.href = "/"; }} />

// //       <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
// //         <PageHeader title="Employee Management" subtitle="Add and manage system employees" />

// //         {/* ✅ Clean 2-Column Form */}
// //         <form onSubmit={addEmployee} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, margin: "20px 0", background: theme.cardBg, padding: "20px 0", borderRadius: 16, border: `1px solid ${theme.border}` }}>
          
// //           <input style={input} placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
// //           <input style={input} type="number" placeholder="SAP ID (7 Digits)" value={form.sapId} onChange={(e) => setForm({ ...form, sapId: e.target.value })} required />
          
// //           <input style={input} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
// //           <select style={select} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
// //             <option value="employee" style={{ background: '#1E293B' }}>Employee</option>
// //             <option value="admin" style={{ background: '#1E293B' }}>Admin</option>
// //           </select>

// //           <select style={select} value={form.deptId} onChange={(e) => setForm({ ...form, deptId: e.target.value })} required>
// //             <option value="" style={{ background: '#1E293B' }}>Select Department</option>
// //             {departments.map(d => (
// //               <option key={d.id} value={d.id} style={{ background: '#1E293B' }}>{d.name}</option>
// //             ))}
// //           </select>

// //           <select style={select} value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })}>
// //             <option value="" style={{ background: '#1E293B' }}>Select Section</option>
// //             {sections.map(s => (
// //               <option key={s.id} value={s.id} style={{ background: '#1E293B' }}>{s.section_name}</option>
// //             ))}
// //           </select>

// //           <input style={input} type="tel" placeholder="Contact Number" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          
// //           <button type="submit" style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer", fontWeight: 600, boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>+ Add Employee</button>
// //         </form>

// //         {/* ✅ Professional Fixed-Width Table */}
// //         <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden" }}>
// //           <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
// //             <thead>
// //               <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
// //                 <th style={{ width: "15%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>NAME</th>
// //                 <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>SAP ID</th>
// //                 <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>ROLE</th>
// //                 <th style={{ width: "20%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>DEPARTMENT</th>
// //                 <th style={{ width: "20%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>SECTION</th>
// //                 <th style={{ width: "15%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>CONTACT</th>
// //                 <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>STATUS</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {currentData.map(v => (
// //                 <tr key={v.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
// //                   <td style={{ padding: "12px 16px", color: theme.text, fontWeight: 600, fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.name}</td>
// //                   <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.sap_id}</td>
// //                   <td style={{ padding: "12px 16px", color: v.role === 'admin' ? '#F59E0B' : '#3B82F6', fontSize: "13px", fontWeight: 600 }}>{v.role}</td>
// //                   <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.dept_name || "-"}</td>
// //                   <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.section_name || "-"}</td>
// //                   <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.contact || "-"}</td>
// //                   <td style={{ padding: "12px 16px", color: v.status === "active" ? "#34D399" : "#F87171", fontSize: "13px", fontWeight: 600 }}>{v.status}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import PageHeader from "../components/PageHeader";
// import Pagination from "../components/Pagination";
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
//   outline: "none",
//   transition: "all 0.15s",
//   WebkitBoxShadow: "0 0 0 1000px transparent inset", 
//   boxShadow: "0 0 0 1000px transparent inset",
  
//   ":focus": {
//     borderColor: "#3B82F6",
//     backgroundColor: "transparent" 
//   }
// };

// const select = {
//   ...input,
//   cursor: "pointer",
// };
// export default function EmployeesPage() {
//   const navigate = useNavigate();
//   const { isDark } = useTheme();
//   const theme = { 
//     bg: isDark ? '#080C18' : '#080C18', 
//     cardBg: isDark ? '#0F172A' : '#080C18', 
//     text: isDark ? '#80a3d0' : '#1E293B', 
//     subText: isDark ? '#94A3B8' : '#64748B', 
//     border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' 
//   };
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const token = localStorage.getItem("token");
//   const headers = { Authorization: `Bearer ${token}` };

//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [sections, setSections] = useState([]);
  
//   const [form, setForm] = useState({ 
//     name: "", 
//     sapId: "", 
//     password: "", 
//     role: "employee", 
//     deptId: "", 
//     sectionId: "", 
//     contact: "" 
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const totalPages = Math.ceil(employees.length / itemsPerPage);
//   const currentData = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const load = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/masters/employees`, { headers });
//       setEmployees(res.data);
//     } catch (err) { console.error(err); }
//   };

//   const loadDepartments = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/masters/departments`, { headers });
//       setDepartments(res.data);
//     } catch (err) { console.error(err); }
//   };

//   const loadSections = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/masters/sections`, { headers });
//       setSections(res.data);
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => { 
//     load(); 
//     loadDepartments();
//     loadSections();
//   }, []);

//   const addEmployee = async (e) => {
//     e.preventDefault();
//     if (form.sapId.length !== 7) {
//       alert("SAP ID must be exactly 7 digits.");
//       return;
//     }
//     try {
//       await axios.post(`${API_BASE_URL}/api/masters/employees`, form, { headers });
//       alert("Employee added successfully!");
//       setForm({ name: "", sapId: "", password: "", role: "employee", deptId: "", sectionId: "", contact: "" });
//       load();
//     } catch (err) {
//       alert(err.response?.data?.message || "Error adding employee");
//     }
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
//       <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.href = "/"; }} />

//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
//         <PageHeader title="Employee Management" subtitle="Add and manage system employees" />

//         {/* ✅ Form Card */}
//         <div style={{ 
//           background: theme.cardBg, 
//           border: `1px solid ${theme.border}`, 
//           borderRadius: 16, 
//           padding: "20px", 
//           marginBottom: "20px",
//           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
//         }}>
//           <form onSubmit={addEmployee} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 15, alignItems: "center" }}>
            
//             <input style={input} placeholder="Full Name" value={form.name} autoComplete="off" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            
//               <input 
//               style={input} 
//               type="number" 
//               placeholder="SAP ID (7 Digits)" 
//               value={form.sapId} 
//               onChange={(e) => setForm({ ...form, sapId: e.target.value })} 
//               required 
//               autoComplete="off" 
//                autofill="off" 
//             />
//                 <input 
//                 style={input} 
//                 type="password" 
//                 placeholder="Password" 
//                 value={form.password} 
//                 onChange={(e) => setForm({ ...form, password: e.target.value })} 
//                 required 
//                 autoComplete="new-password"/>
//             <select style={select} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
//               <option value="employee" style={{ background: '#1E293B' }}>Employee</option>
//               <option value="admin" style={{ background: '#1E293B' }}>Admin</option>
//             </select>

//             <select style={select} value={form.deptId} onChange={(e) => setForm({ ...form, deptId: e.target.value })} required>
//               <option value="" style={{ background: '#1E293B' }}>Select Department</option>
//               {departments.map(d => (
//                 <option key={d.id} value={d.id} style={{ background: '#1E293B' }}>{d.name}</option>
//               ))}
//             </select>

//             <select style={select} value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })}>
//               <option value="" style={{ background: '#1E293B' }}>Select Section</option>
//               {sections.map(s => (
//                 <option key={s.id} value={s.id} style={{ background: '#1E293B' }}>{s.section_name}</option>
//               ))}
//             </select>

//             <input style={input} type="tel" placeholder="Contact Number" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            
//             <button type="submit" style={{ 
//               background: "#3B82F6", 
//               color: "#fff", 
//               border: "none", 
//               borderRadius: 8, 
//               padding: "10px 20px", 
//               cursor: "pointer", 
//               fontWeight: 600, 
//               height: "44px", 
//               boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
//               transition: "all 0.15s"
//             }}>+ Add Employee</button>
//           </form>
//         </div>

//         {/* ✅ Professional Table */}
//         <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
//             <thead>
//               <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
//                 <th style={{ width: "15%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>NAME</th>
//                 <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>SAP ID</th>
//                 <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>ROLE</th>
//                 <th style={{ width: "20%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>DEPARTMENT</th>
//                 <th style={{ width: "20%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>SECTION</th>
//                 <th style={{ width: "15%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>CONTACT</th>
//                 <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>STATUS</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentData.map(v => (
//                 <tr key={v.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
//                   <td style={{ padding: "12px 16px", color: theme.text, fontWeight: 600, fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.name}</td>
//                   <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.sap_id}</td>
//                   <td style={{ padding: "12px 16px", color: v.role === 'admin' ? '#F59E0B' : '#3B82F6', fontSize: "13px", fontWeight: 600 }}>{v.role}</td>
//                   <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.dept_name || "-"}</td>
//                   <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.section_name || "-"}</td>
//                   <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.contact || "-"}</td>
//                   <td style={{ padding: "12px 16px", color: v.status === "active" ? "#34D399" : "#F87171", fontSize: "13px", fontWeight: 600 }}>{v.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { useTheme } from '../context/ThemeContext';

// ✅ TOAST NOTIFICATION COMPONENT
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  
  const bgColor = type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(16,185,129,0.9)';
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: bgColor,
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'fadeDown 0.3s ease',
      minWidth: '250px'
    }}>
      <span>{message}</span>
      <span onClick={onClose} style={{ cursor: 'pointer', fontSize: '16px' }}>✕</span>
    </div>
  );
};

export default function EmployeesPage() {
  const { isDark } = useTheme();
  const theme = { bg: isDark ? '#080C18' : '#F1F5F9', cardBg: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#1E293B', subText: isDark ? '#94A3B8' : '#64748B', border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' };
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
    outline: "none",
    transition: "all 0.15s",
  };
  const select = {
    ...input,
    cursor: "pointer",
  };
  const optionStyle = { background: isDark ? '#1E293B' : '#FFFFFF', color: theme.text };
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  
  const emptyForm = {
    name: "", 
    sapId: "", 
    password: "", 
    role: "employee", 
    deptId: "", 
    sectionId: "", 
    contact: "" 
  };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  // ✅ Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const currentData = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const load = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/masters/employees`, { headers });
      setEmployees(res.data);
    } catch (err) { console.error(err); }
  };

  const loadDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/masters/departments`, { headers });
      setDepartments(res.data.filter(dept => dept.status === 'active'));
    } catch (err) { console.error(err); }
  };

  const loadSections = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/masters/sections`, { headers });
      setSections(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { 
    load(); 
    loadDepartments();
    loadSections();
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    // Regex: Sirf A-Z, a-z, aur space
    if (/^[a-zA-Z\s]*$/.test(val)) {
      setForm({ ...form, name: val });
    }
  };

  const handleNameBlur = () => {
    const formattedName = form.name
      .toLowerCase()                 
      .split(' ')                 
      .map(word => 
        word.charAt(0).toUpperCase() + word.slice(1) 
      )
      .join(' ');
    
    setForm({ ...form, name: formattedName });
  };

  const saveEmployee = async (e) => {
    e.preventDefault();
    
    if (form.sapId.length !== 7) {
      setToast({ show: true, message: "SAP ID must be exactly 7 digits.", type: "error" });
      return;
    }

    if (form.name.trim() === "") {
      setToast({ show: true, message: "Full Name is required.", type: "error" });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/masters/employees/${editingId}`, form, { headers });
        setToast({ show: true, message: "Employee updated successfully!", type: "success" });
      } else {
        await axios.post(`${API_BASE_URL}/api/masters/employees`, form, { headers });
        setToast({ show: true, message: "Employee added successfully!", type: "success" });
      }

      setForm(emptyForm);
      setEditingId(null);
      load();
      
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || "Error saving employee", type: "error" });
    }
  };

  const editEmployee = (employee) => {
    setEditingId(employee.id);
    setForm({
      name: employee.name || "",
      sapId: employee.sap_id || "",
      password: "",
      role: employee.role || "employee",
      deptId: employee.dept_id ? String(employee.dept_id) : "",
      sectionId: employee.section_id ? String(employee.section_id) : "",
      contact: employee.contact || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await axios.put(
        `${API_BASE_URL}/api/masters/employees/${id}/status`,
        { status: nextStatus },
        { headers }
      );
      setToast({
        show: true,
        message: `Employee ${nextStatus === "active" ? "activated" : "deactivated"} successfully!`,
        type: "success",
      });
      load();
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || "Error updating employee status", type: "error" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>

      <style>
        {`
          input.no-autofill {
            background-color: ${isDark ? '#080C18' : '#FFFFFF'} !important; 
            -webkit-box-shadow: 0 0 0px 1000px ${isDark ? '#080C18' : '#FFFFFF'} inset !important;
            -webkit-text-fill-color: ${theme.text} !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}
      </style>

      <Navbar user={user} onLogout={() => { localStorage.clear(); window.location.href = "/"; }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        
        {/* ✅ Toast Render */}
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false })} />}

        <PageHeader title="Employee Management" subtitle="Add and manage system employees" />

        <div style={{ 
          background: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: 16, 
          padding: "20px", 
          marginBottom: "20px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        }}>
          <form onSubmit={saveEmployee} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 15, alignItems: "center" }}>
            
            <input 
              style={input} 
              placeholder="Full Name" 
              value={form.name} 
              onChange={handleNameChange}     
              onBlur={handleNameBlur}         
              required 
            />
            
           <input
                className="no-autofill"
                name="emp_sap_id"
                autoComplete="off"
                style={input}
                type="number"
                placeholder="SAP ID (7 Digits)"
                value={form.sapId}
                onChange={(e) => setForm({ ...form, sapId: e.target.value })}
                required
              />
            
            <input
                  className="no-autofill"
                  name="emp_password" 
                  autoComplete="new-password" 
                  style={input}
                  type="password"
                  placeholder={editingId ? "New Password (optional)" : "Password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editingId}
                />
            <select style={select} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
              <option value="employee" style={optionStyle}>Employee</option>
              <option value="admin" style={optionStyle}>Admin</option>
            </select>

            <select
              style={select}
              value={form.deptId}
              onChange={(e) => setForm({ ...form, deptId: e.target.value, sectionId: "" })}
              required
            >
              <option value="" style={optionStyle}>Select Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id} style={optionStyle}>{d.name}</option>
              ))}
            </select>

            <select
              style={{ ...select, opacity: form.deptId ? 1 : 0.65 }}
              value={form.sectionId}
              onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
              disabled={!form.deptId}
            >
              <option value="" style={optionStyle}>
                {form.deptId ? "Select Section" : "Select Department First"}
              </option>
              {sections.filter(s => String(s.dept_id) === String(form.deptId)).map(s => (
                <option key={s.id} value={s.id} style={optionStyle}>{s.section_name}</option>
              ))}
            </select>

            <input
              style={input}
              type="tel"
              maxLength={10}
              placeholder="Contact Number"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value.replace(/[^0-9]/g, '') })}
            />
            
            <button type="submit" style={{ 
              background: "#3B82F6", 
              color: "#fff", 
              border: "none", 
              borderRadius: 8, 
              padding: "10px 20px", 
              cursor: "pointer", 
              fontWeight: 600, 
              height: "44px", 
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)" 
            }}>{editingId ? "Save Employee" : "+ Add Employee"}</button>
            {editingId && (
              <button type="button" onClick={cancelEdit} style={{ 
                background: "rgba(100,116,139,0.12)", 
                color: theme.subText, 
                border: `1px solid ${theme.border}`, 
                borderRadius: 8, 
                padding: "10px 20px", 
                cursor: "pointer", 
                fontWeight: 600, 
                height: "44px" 
              }}>Cancel</button>
            )}
          </form>
        </div>

        {/* ✅ Professional Table */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                <th style={{ width: "13%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>NAME</th>
                <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>SAP ID</th>
                <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>ROLE</th>
                <th style={{ width: "16%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>DEPARTMENT</th>
                <th style={{ width: "14%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>SECTION</th>
                <th style={{ width: "12%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>CONTACT</th>
                <th style={{ width: "8%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>STATUS</th>
                <th style={{ width: "17%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(v => (
                <tr key={v.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: "12px 16px", color: theme.text, fontWeight: 600, fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.name}</td>
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.sap_id}</td>
                  <td style={{ padding: "12px 16px", color: v.role === 'admin' ? '#F59E0B' : '#3B82F6', fontSize: "13px", fontWeight: 600 }}>{v.role}</td>
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.dept_name || "-"}</td>
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.section_name || "-"}</td>
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }} >{v.contact || "-"}</td>
                  <td style={{ padding: "12px 16px", color: v.status === "active" ? "#34D399" : "#F87171", fontSize: "13px", fontWeight: 600 }}>{v.status}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => editEmployee(v)}
                        style={{
                          background: "rgba(59, 130, 246, 0.1)",
                          color: "#3B82F6",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          borderRadius: 6,
                          padding: "6px 8px",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(v.id, v.status)}
                        style={{
                          background: v.status === "active" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                          color: v.status === "active" ? "#F87171" : "#34D399",
                          border: `1px solid ${v.status === "active" ? "rgba(239, 68, 68, 0.35)" : "rgba(16, 185, 129, 0.35)"}`,
                          borderRadius: 6,
                          padding: "6px 8px",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
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


