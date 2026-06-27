import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

export const useMediaQuery = (query) => {
  const subscribe = useCallback(
    (callback) => {
      if (typeof window === 'undefined') return () => undefined;
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches),
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
