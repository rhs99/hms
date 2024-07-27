import React, { useState } from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
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

  const login = (userName, userId) => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userId', userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
  };

  const getStoredValue = () => {
    return {
      userName: localStorage.getItem('userName') || '',
      userId: localStorage.getItem('userId') || '',
    };
  };

  const contextValue = {
    isLoggedIn,
    login,
    logout,
    getStoredValue,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
