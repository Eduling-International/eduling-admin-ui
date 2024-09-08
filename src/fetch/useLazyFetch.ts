import { useCallback, useReducer } from 'react';
import { reducer } from './reducer';
import { FetchState } from './types';
import { ExchangeResponse } from '@/models';

const useLazyFetch = <T, P extends any[]>(
  fetchFunc: (...args: P) => Promise<ExchangeResponse<T>>,
): [FetchState<T>, (...args: P) => Promise<void>] => {
  const [state, dispatch] = useReducer(reducer<T>, {
    loading: false,
    data: null as T,
    error: null,
  } satisfies FetchState<T>);

  const execute = useCallback(
    async (...args: P) => {
      dispatch({ type: 'EXECUTE' });
      const res = await fetchFunc(...args);
      if (!res.isError) {
        dispatch({ type: 'OK', payload: res.data });
      } else {
        dispatch({ type: 'ERROR', payload: res.message });
      }
    },
    [fetchFunc],
  );

  return [state, execute] as const;
};

export default useLazyFetch;
