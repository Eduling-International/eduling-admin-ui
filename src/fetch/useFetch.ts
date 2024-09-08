import { ExchangeResponse } from '@/models';
import { FetchState } from './types';
import { useEffect, useReducer } from 'react';
import { reducer } from './reducer';

export const useFetch = <T, P extends any[]>(
  fetchFunc: (...args: P) => Promise<ExchangeResponse<T>>,
  ...args: P
): FetchState<T> => {
  const [state, dispatch] = useReducer(reducer<T>, {
    loading: false,
    data: null as T,
    error: null,
  } satisfies FetchState<T>);

  useEffect(() => {
    const execute = async () => {
      dispatch({ type: 'EXECUTE' });
      const res = await fetchFunc(...args);
      if (!res.isError) {
        dispatch({ type: 'OK', payload: res.data });
      } else {
        dispatch({ type: 'ERROR', payload: res.message });
      }
    };
    execute();
  }, []);

  return state;
};
