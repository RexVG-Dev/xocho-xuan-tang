'use client';

import {
  createContext,
  useState,
  ReactNode
} from 'react';

export type LoaderType = 'changes' | 'get' | 'login' | 'upload' | 'delete' | 'custom' | 'default';

type ShowLoaderType = {
  type?: LoaderType;
  customMessage?: string
};
export interface LoadingContextType {
  isLoading: boolean;
  message: string;
  showLoader: ({type, customMessage}: ShowLoaderType) => void;
  hideLoader: () => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

const messages: Record<LoaderType, string> = {
  changes: 'Espera un momento, estamos guardando tus cambios.',
  get: 'Estamos obteniendo tu información.',
  login: 'Estamos validando tus credenciales.',
  upload: 'Subiendo tus archivos, por favor espera.',
  delete: 'Eliminando el registro de forma permanente.',
  custom: '',
  default: 'Procesando...',
};

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(messages.default);

  const showLoader = ({
    type = 'default',
    customMessage
  }: ShowLoaderType) => {
    if (type === 'custom' && customMessage) {
      setMessage(customMessage);
    } else {
      setMessage(messages[type]);
    }
    setIsLoading(true);
  };
  const hideLoader = () => setIsLoading(false);

  const value = { isLoading, message, showLoader, hideLoader };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

