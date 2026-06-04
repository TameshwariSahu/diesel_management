import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate('/'); // No token? Go to Login
        return;
      }

      try {
        // Call a backend route to verify the token is still valid
        const res = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userRole = res.data?.user?.role;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : allowedRoles ? [allowedRoles] : [];
        if (roles.length > 0 && !roles.includes(userRole)) {
          navigate(userRole === 'admin' ? '/admin' : '/department');
          return;
        }

        setIsValid(true); // Token is good
      } catch (error) {
        console.error("Session invalid:", error);
        localStorage.clear(); // Clear bad token
        navigate('/'); // Go to Login
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate, allowedRoles]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#080C18', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        color: '#fff' 
      }}>
        Checking Session...
      </div>
    );
  }

  return isValid ? children : null;
};

export default ProtectedRoute;


