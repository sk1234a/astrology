import { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const AuthCtx = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) return null;

    try {
      return JSON.parse(localStorage.getItem('admin_info') || 'null');
    } catch {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_info');
      return null;
    }
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_info', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.clear();
    setAdmin(null);
  };

  return <AuthCtx.Provider value={{ admin, login, logout }}>{children}</AuthCtx.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);
