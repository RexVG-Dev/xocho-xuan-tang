"use client";
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type ApiStatus = 'idle' | 'pending' | 'success' | 'error';

export interface ApiCallState {
  status: ApiStatus;
  error?: any;
  data?: any;
}

export interface ApiState {
  [key: string]: ApiCallState;
}

export type ApiAction =
  | { type: 'REQUEST'; key: string }
  | { type: 'SUCCESS'; key: string; data: any }
  | { type: 'ERROR'; key: string; error: any }
  | { type: 'RESET'; key: string };

function apiReducer(state: ApiState, action: ApiAction): ApiState {
  switch (action.type) {
    case 'REQUEST':
      return { ...state, [action.key]: { status: 'pending' } };
    case 'SUCCESS':
      return { ...state, [action.key]: { status: 'success', data: action.data } };
    case 'ERROR':
      return { ...state, [action.key]: { status: 'error', error: action.error } };
    case 'RESET':
      return { ...state, [action.key]: { status: 'idle' } };
    default:
      return state;
  }
}

const ApiStateContext = createContext<{
  state: ApiState;
  dispatch: React.Dispatch<ApiAction>;
} | undefined>(undefined);

export function ApiStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(apiReducer, {});
  return (
    <ApiStateContext.Provider value={{ state, dispatch }}>
      {children}
    </ApiStateContext.Provider>
  );
}

export function useApiState() {
  const context = useContext(ApiStateContext);
  if (!context) throw new Error('useApiState must be used within ApiStateProvider');
  return context;
}
