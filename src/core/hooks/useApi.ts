import { ExchangeResponse } from '@/models';
import { useCallback, useEffect, useReducer } from 'react';

type AnyFunctionWithPromise<T> = (
  ...args: any[]
) => Promise<ExchangeResponse<T>>;

type ExecuteApi = {
  type: 'execute';
};

type ReceiveOk<T = null> = {
  type: 'ok';
  payload: T | null;
};

type ReceiveError = {
  type: 'error';
  payload: string | null;
};

type ApiAction<T = null> = ExecuteApi | ReceiveOk<T> | ReceiveError;

type ApiState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

const apiReducer = <T>(
  state: ApiState<T>,
  action: ApiAction<T>,
): ApiState<T> => {
  switch (action.type) {
    case 'execute':
      return {
        data: null,
        error: null,
        loading: true,
      };
    case 'ok':
      return {
        loading: false,
        data: action.payload,
        error: null,
      };
    case 'error':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return { ...state };
  }
};

export const useAPI = <T, P>(
  exchange: (params: P) => Promise<ExchangeResponse<T>>,
  params: P = {} as P,
) => {
  const [apiState, dispatch] = useReducer(apiReducer<T>, {
    loading: false,
    data: null as T,
    error: null,
  } satisfies ApiState<T>);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'execute' });
      const res = await exchange(params);
      if (!res.isError) {
        dispatch({ type: 'ok', payload: res.data });
      } else {
        dispatch({ type: 'error', payload: res.message });
      }
    };
    fetchData();
  }, []);

  return apiState;
};

export const useLazyAPI = <T, P extends any[]>(
  exchange: (...args: P) => Promise<ExchangeResponse<T>>,
): [ApiState<T>, (...args: P) => Promise<void>] => {
  const [apiState, dispatch] = useReducer(apiReducer<T>, {
    loading: false,
    data: null as T,
    error: null,
  } satisfies ApiState<T>);

  const execute = useCallback(async (...args: P) => {
    dispatch({ type: 'execute' });
    exchange(...args).then((res) => {
      if (!res.isError) {
        dispatch({ type: 'ok', payload: res.data });
      } else {
        dispatch({ type: 'error', payload: res.message });
      }
    });
  }, []);

  return [apiState, execute];
};

export const useImmediateApi = <T>(
  exchange: () => Promise<ExchangeResponse<T>>,
) => {
  const [apiState, dispatch] = useReducer(apiReducer<T>, {
    loading: false,
    data: null as T,
    error: null,
  } satisfies ApiState<T>);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'execute' });
      const res = await exchange();
      if (!res.isError) {
        dispatch({ type: 'ok', payload: res.data });
      } else {
        dispatch({ type: 'error', payload: res.message });
      }
    };
    fetchData();
  }, []);

  return apiState;
};

export const useLazyApi = <T>(
  exchange: (...params: any) => Promise<ExchangeResponse<T>>,
): [ApiState<T>, (...params: any) => Promise<void>] => {
  const [apiState, dispatch] = useReducer(apiReducer<T>, {
    loading: false,
    data: null as T,
    error: null,
  } satisfies ApiState<T>);

  const execute = useCallback(async (...params: any) => {
    dispatch({ type: 'execute' });
    exchange(...params).then((res) => {
      if (!res.isError) {
        dispatch({ type: 'ok', payload: res.data });
      } else {
        dispatch({ type: 'error', payload: res.message });
      }
    });
  }, []);

  return [apiState, execute];
};
