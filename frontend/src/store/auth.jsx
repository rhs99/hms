import React, { useState } from 'react';
import axios from 'axios';

const applyAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const storedToken = localStorage.getItem('accessToken');
if (storedToken) {
  applyAuthHeader(storedToken);
}

const AuthContext = React.createContext({
  isLoggedIn: false,
  isAdmin: false,
  login: () => undefined,
  logout: () => undefined,
  getStoredValue: () => {
    return {
      userName: '',
      userId: '',
    };
  },
});

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userName') !== null || false);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  const login = ({ userName, userId, isAdmin, accessToken }) => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userId', userId);
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    localStorage.setItem('accessToken', accessToken);
    applyAuthHeader(accessToken);
    setIsLoggedIn(true);
    setIsAdmin(Boolean(isAdmin));
  };

  const logout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('accessToken');
    applyAuthHeader(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const getStoredValue = () => {
    return {
      userName: localStorage.getItem('userName') || '',
      userId: localStorage.getItem('userId') || '',
    };
  };

  const contextValue = {
    isLoggedIn,
    isAdmin,
    login,
    logout,
    getStoredValue,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
