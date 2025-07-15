import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../utils/axios.js';

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { user: verifiedUser, token: newToken } = response.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(verifiedUser));
        setUser(verifiedUser);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const interval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`

            }
          });
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setUser(res.data.user);
        } catch {
          clearInterval(interval);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [location]);

  if (loading) return null;

  if (!user) {
    console.log("return / login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
