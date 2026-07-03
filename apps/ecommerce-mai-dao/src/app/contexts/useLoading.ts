'use client';

import { useContext, createContext } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  message: string;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  message: '',
});

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    return {
      isLoading: false,
      message: '',
    };
  }
  return context;
}

export { LoadingContext };
