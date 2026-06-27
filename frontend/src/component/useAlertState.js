import { useCallback, useRef, useState } from 'react';

export const useAlertState = (autoDismissMs = 4000) => {
  const [alert, setAlert] = useState(null);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setAlert(null);
  }, []);

  const show = useCallback(
    (intent, message) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setAlert({ intent, message });
      if (autoDismissMs && intent !== 'danger') {
        timerRef.current = setTimeout(() => setAlert(null), autoDismissMs);
      }
    },
    [autoDismissMs]
  );

  return { alert, show, dismiss };
};
