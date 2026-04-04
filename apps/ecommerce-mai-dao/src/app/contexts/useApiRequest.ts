import { useCallback } from 'react';
import { apiRequest, ApiRequestOptions } from './apiClient';
import { useApiState } from './apiState.context';

export function useApiRequest<T = unknown>(key: string) {
  const { state, dispatch } = useApiState();
  const call = useCallback(
    async (url: string, options?: ApiRequestOptions) => {
      dispatch({ type: 'REQUEST', key });
      try {
        const data = await apiRequest<T>(url, options);
        dispatch({ type: 'SUCCESS', key, data });
        return data;
      } catch (error) {
        dispatch({ type: 'ERROR', key, error });
        throw error;
      }
    },
    [dispatch, key]
  );
  return {
    status: state[key]?.status || 'idle',
    data: state[key]?.data as T | undefined,
    error: state[key]?.error,
    call,
    reset: () => dispatch({ type: 'RESET', key })
  };
}
