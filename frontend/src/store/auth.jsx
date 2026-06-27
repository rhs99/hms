import React, { useState } from 'react';
import axios from 'axios';

import Config from '../config';

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';
const SAFE_METHODS = new Set(['get', 'head', 'options']);

const readCookie = (name) => {
  const prefix = `${name}=`;
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
};

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  if (!SAFE_METHODS.has(method)) {
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) {
      config.headers = config.headers || {};
      config.headers[CSRF_HEADER] = csrf;
    }
  }
  return config;
});

const clearLocalAuthState = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('isAdmin');
};

// Auto-logout on 401: server says our session is gone, drop UI state too.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && localStorage.getItem('userName') !== null) {
      clearLocalAuthState();
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

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

  const login = ({ userName, userId, isAdmin }) => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userId', userId);
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    setIsLoggedIn(true);
    setIsAdmin(Boolean(isAdmin));
  };

  const logout = () => {
    // Clear local state synchronously so the UI updates immediately,
    // then fire-and-forget the server call to clear the cookies.
    clearLocalAuthState();
    setIsLoggedIn(false);
    setIsAdmin(false);
    axios.delete(`${Config.SERVER_URL}/sessions`).catch(() => undefined);
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
