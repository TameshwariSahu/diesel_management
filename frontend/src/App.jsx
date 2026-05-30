// import { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import AdminDashboard from './pages/AdminDashboard';
// import DeptDashboard from './pages/DeptDashboard';
// import VehiclesPage from './pages/VehiclesPage';
// import DeptDepartmentsPage from './pages/DeptDepartments';
// import SectionsPage from './pages/SectionsPage';
// import EmployeesPage from './pages/EmployeesPage';
// import LandingPage from './pages/LandingPage';

// function App() {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
//         <Route path="/admin/vehicles" element={token && role === 'admin' ? <VehiclesPage /> : <Navigate to="/login" />} />
//         <Route path="/admin/departments" element={token && role === 'admin' ? <DepartmentsPage /> : <Navigate to="/login" />} />
//         <Route path="/admin/sections" element={token && role === 'admin' ? <SectionsPage /> : <Navigate to="/login" />} />
//         <Route path="/admin/employees" element={token && role === 'admin' ? <EmployeesPage /> : <Navigate to="/login" />} />
//         <Route path="/deptdepartment" element={token && role === 'deptdepartment' ? <DeptDashboard /> : <Navigate to="/login" />} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DepartmentsPage from './pages/DepartmentsPage'; 
import VehiclesPage from './pages/VehiclesPage';
import DeptDashboard from './pages/DeptDashboard';
import SectionsPage from './pages/SectionsPage'; 
import EmployeesPage from './pages/EmployeesPage';
import LandingPage from './pages/LandingPage';
import ThemeContext from '../context/ThemeContext';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <route path="/login" element={<Login />} />
        <route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Route path="/login" />} /> {/* ✅ Check this */}
        <Route path="/admin/departments" element={token && role === 'admin' ? <DepartmentsPage /> : <Route path="/login" />} /> {/* ✅ Check this too */}
        <Route path="/admin/vehicles" element={token && role === 'admin' ? <Route path="/admin/vehicles" /> : <Route path="/login" /> } /> {/* ✅ Changed from /> to <Route path="/admin/vehicles" /> (Using Route Path to distinguish for clarity) */}
        <Route path="/department" element={token && role === 'deptdepartment' ? <DeptDashboard /> : <Route path="/login" />} /> {/* ✅ Check this too */}
        <Route path="/admin/employees" element={token && role === 'admin' ? <EmployeesPage /> : <Route path="/login" />} />
        <Route path="/admin/section" element={token && role === 'admin' ? <SectionsPage /> : <Route path="/login" />} /> {/* ✅ Check this too */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;