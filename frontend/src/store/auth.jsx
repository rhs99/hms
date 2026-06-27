import React, { useState } from 'react';
import axios from 'axios';

const USER_ID_HEADER = 'X-User-Id';

const applyUserIdHeader = (userId) => {
  if (userId) {
    axios.defaults.headers.common[USER_ID_HEADER] = userId;
  } else {
    delete axios.defaults.headers.common[USER_ID_HEADER];
  }
};

const storedUserId = localStorage.getItem('userId');
if (storedUserId) {
  applyUserIdHeader(storedUserId);
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

  const login = (userName, userId, isAdmin) => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userId', userId);
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    applyUserIdHeader(userId);
    setIsLoggedIn(true);
    setIsAdmin(Boolean(isAdmin));
  };

  const logout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    applyUserIdHeader(null);
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
