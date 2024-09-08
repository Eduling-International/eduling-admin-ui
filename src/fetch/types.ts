export interface FetchState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * Execute fetching API action.
 */
export type ExecuteAction = {
  type: 'EXECUTE';
};

/**
 * Return OK from API action.
 */
export type ReceiveOKAction<T = null> = {
  type: 'OK';
  payload: T | null;
};

export type ReceiveErrorAction = {
  type: 'ERROR';
  payload: string | null;
};

export type FetchingAction<T = null> = ExecuteAction | ReceiveOKAction<T> | ReceiveErrorAction;
