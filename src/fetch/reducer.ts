import { FetchState, FetchingAction } from './types';

export const reducer = <T>(
  currentState: FetchState<T>,
  action: FetchingAction<T>,
): FetchState<T> => {
  switch (action.type) {
    case 'EXECUTE':
      return {
        data: null,
        error: null,
        loading: true,
      };
    case 'OK':
      return {
        data: action.payload,
        error: null,
        loading: false,
      };
    case 'ERROR':
      return {
        ...currentState,
        error: action.payload,
        loading: false,
      };
  }
};
