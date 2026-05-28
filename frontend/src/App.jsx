
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DeptDashboard from './pages/DeptDashboard';
import VehiclesPage from './pages/VehiclesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import LandingPage from './pages/LandingPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role')
  });

  useEffect(() => {
    const checkAuth = () => {
      setAuthState({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role')
      });
    };

    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={authState.token && authState.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/vehicles" element={authState.token && authState.role === 'admin' ? <VehiclesPage /> : <Navigate to="/" />} />
          <Route path="/admin/departments" element={authState.token && authState.role === 'admin'? <DepartmentsPage /> : <Navigate to="/" />} />
          <Route path="/department" element={authState.token && authState.role === 'department' ? <DeptDashboard /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;