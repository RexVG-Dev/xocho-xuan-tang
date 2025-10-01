'use client';

import React, {
  createContext,
  useState,
  ReactNode
} from 'react';

export type NotificationType = 'success' | 'error';

export interface NotificationOptions {
  type: NotificationType;
  message?: string;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationContextType {
  notification: NotificationOptions | null;
  showNotification: (options: NotificationOptions) => void;
  hideNotification: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationOptions | null>(null);

  const showNotification = (options: NotificationOptions) => {
    setNotification(options);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const value = { notification, showNotification, hideNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

