import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import DeptDashboard from './pages/DeptDashboard'

function App() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/department" element={token && role === 'department' ? <DeptDashboard /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
