'use client';

import {
  createContext,
  useState,
  ReactNode
} from 'react';

export interface LoadingContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  const value = { isLoading, showLoader, hideLoader };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

