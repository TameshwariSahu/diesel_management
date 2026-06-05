
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from './context/ThemeContext';
// import Login from './pages/Login';
// import AdminDashboard from './pages/AdminDashboard';
// import DepartmentsPage from './pages/DepartmentsPage';
// import VehiclesPage from './pages/VehiclesPage';
// import DeptDashboard from './pages/DeptDashboard';
// import SectionsPage from './pages/SectionsPage';
// import EmployeesPage from './pages/EmployeesPage';
// import LandingPage from './pages/LandingPage';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   return (
//     <ThemeProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
//           <Route path="/admin/departments" element={token && role === 'admin' ? <DepartmentsPage /> : <Navigate to="/login" />} />
//           <Route path="/admin/vehicles" element={token && role === 'admin' ? <VehiclesPage /> : <Navigate to="/login" />} />
//           <Route path="/admin/employees" element={token && role === 'admin' ? <EmployeesPage /> : <Navigate to="/login" />} />
//           <Route path="/admin/section" element={token && role === 'admin' ? <SectionsPage /> : <Navigate to="/login" />} />
//           <Route path="/department" element={token && role === 'employee' ? <DeptDashboard /> : <Navigate to="/login" />} />
//           <Route path="/department" element={<ProtectedRoute> <DepartmentDashboard /> </ProtectedRoute>} />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DepartmentsPage from './pages/DepartmentsPage';
import VehiclesPage from './pages/VehiclesPage';
import SectionsPage from './pages/SectionsPage';
import EmployeesPage from './pages/EmployeesPage';
import ProtectedRoute from './components/ProtectedRoute';
import DeptDashboard from './pages/DeptDashboard'; 

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute allowedRoles="admin"><DepartmentsPage /></ProtectedRoute>} />
          <Route path="/admin/vehicles" element={<ProtectedRoute allowedRoles="admin"><VehiclesPage /></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute allowedRoles="admin"><EmployeesPage /></ProtectedRoute>} />
          <Route path="/admin/sections" element={<ProtectedRoute allowedRoles="admin"><SectionsPage /></ProtectedRoute>} />
          <Route path="/admin/section" element={<Navigate to="/admin/sections" replace />} />
          <Route path="/department" element={<ProtectedRoute allowedRoles={['department', 'employee']}><DeptDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
