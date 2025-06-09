import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuth", "true");
    navigate('/home');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("isAuth", "false");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    navigate('/login');
  };

  return { isAuthenticated, login, logout };
}