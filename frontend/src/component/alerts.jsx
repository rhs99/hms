import { Alert } from '@optiaxiom/react';

export const AlertBanner = ({ alert, onDismiss }) => {
  if (!alert) return null;
  return (
    <Alert intent={alert.intent} onDismiss={onDismiss}>
      {alert.message}
    </Alert>
  );
};
