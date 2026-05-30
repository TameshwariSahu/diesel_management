// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
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
// //       const res = await axios.get("http://localhost:5000/api/masters/employees", { headers });
// //       setEmployees(res.data);
// //     } catch (err) { console.error(err); }
// //   };

// //   const loadDepartments = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:5000/api/masters/departments", { headers });
// //       setDepartments(res.data);
// //     } catch (err) { console.error(err); }
// //   };

// //   const loadSections = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:5000/api/masters/sections", { headers });
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
// //       await axios.post("http://localhost:5000/api/masters/employees", form, { headers });
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
//       const res = await axios.get("http://localhost:5000/api/masters/employees", { headers });
//       setEmployees(res.data);
//     } catch (err) { console.error(err); }
//   };

//   const loadDepartments = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/masters/departments", { headers });
//       setDepartments(res.data);
//     } catch (err) { console.error(err); }
//   };

//   const loadSections = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/masters/sections", { headers });
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
//       await axios.post("http://localhost:5000/api/masters/employees", form, { headers });
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { useTheme } from '../context/ThemeContext';

const input = {
  background: "#080C18",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "8px",
  padding: "10px 14px",
  color: "#F1F5F9",
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
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const theme = { bg: isDark ? '#080C18' : '#F1F5F9', cardBg: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#1E293B', subText: isDark ? '#94A3B8' : '#64748B', border: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.05)' };
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  
  const [form, setForm] = useState({ 
    name: "", 
    sapId: "", 
    password: "", 
    role: "employee", 
    deptId: "", 
    sectionId: "", 
    contact: "" 
  });

  // ✅ Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const currentData = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const load = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/masters/employees", { headers });
      setEmployees(res.data);
    } catch (err) { console.error(err); }
  };

  const loadDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/masters/departments", { headers });
      setDepartments(res.data);
    } catch (err) { console.error(err); }
  };

  const loadSections = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/masters/sections", { headers });
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

  const addEmployee = async (e) => {
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
      await axios.post("http://localhost:5000/api/masters/employees", form, { headers });
      setToast({ show: true, message: "Employee added successfully!", type: "success" });
      setForm({ name: "", sapId: "", password: "", role: "employee", deptId: "", sectionId: "", contact: "" });
      load();
      
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || "Error adding employee", type: "error" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>

      <style>
        {`
          input.no-autofill {
            background-color: #080C18 !important; 
            -webkit-box-shadow: 0 0 0px 1000px #080C18 inset !important;
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
          <form onSubmit={addEmployee} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 15, alignItems: "center" }}>
            
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
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
            <select style={select} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
              <option value="employee" style={{ background: '#1E293B' }}>Employee</option>
              <option value="admin" style={{ background: '#1E293B' }}>Admin</option>
            </select>

            <select style={select} value={form.deptId} onChange={(e) => setForm({ ...form, deptId: e.target.value })} required>
              <option value="" style={{ background: '#1E293B' }}>Select Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id} style={{ background: '#1E293B' }}>{d.name}</option>
              ))}
            </select>

            <select style={select} value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })}>
              <option value="" style={{ background: '#1E293B' }}>Select Section</option>
              {sections.map(s => (
                <option key={s.id} value={s.id} style={{ background: '#1E293B' }}>{s.section_name}</option>
              ))}
            </select>

            <input style={input} type="tel" placeholder="Contact Number" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            
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
            }}>+ Add Employee</button>
          </form>
        </div>

        {/* ✅ Professional Table */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                <th style={{ width: "15%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>NAME</th>
                <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>SAP ID</th>
                <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>ROLE</th>
                <th style={{ width: "20%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>DEPARTMENT</th>
                <th style={{ width: "20%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>SECTION</th>
                <th style={{ width: "15%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>CONTACT</th>
                <th style={{ width: "10%", padding: "12px 16px", textAlign: "left", color: theme.subText, fontSize: 11, letterSpacing: 0.4 }}>STATUS</th>
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
                  <td style={{ padding: "12px 16px", color: theme.subText, fontSize: "13px" }}>{v.contact || "-"}</td>
                  <td style={{ padding: "12px 16px", color: v.status === "active" ? "#34D399" : "#F87171", fontSize: "13px", fontWeight: 600 }}>{v.status}</td>
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