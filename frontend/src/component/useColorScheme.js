import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'hms.color-scheme';

const readInitial = () => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useColorScheme = () => {
  const [scheme, setScheme] = useState(readInitial);

  useEffect(() => {
    document.documentElement.style.colorScheme = scheme;
    window.localStorage.setItem(STORAGE_KEY, scheme);
  }, [scheme]);

  const toggle = useCallback(() => {
    setScheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { scheme, toggle };
};
