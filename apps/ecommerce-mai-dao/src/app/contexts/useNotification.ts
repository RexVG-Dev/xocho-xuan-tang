'use client';

import { useContext, createContext } from 'react';

interface NotificationContextType {
  notification: {
    type?: 'success' | 'error';
    message?: string;
    secondaryAction?: {
      label: string;
      onClick: () => void;
    };
  } | null;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  hideNotification: () => {},
});

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notification: null,
      hideNotification: () => {},
    };
  }
  return context;
}

export { NotificationContext };
