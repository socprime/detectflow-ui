import { ApiError } from '../models/providers';

export interface BaseState {
  loading: boolean;
  error: string | null;
}

export interface LoadingState {
  list?: boolean;
  details?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  [key: string]: boolean | undefined;
}

export const createBaseActions = <T extends BaseState>(
  initialState: T,
  set: (state: Partial<T>) => void,
) => ({
  clearError: () => {
    set({ error: null } as Partial<T>);
  },
  reset: () => {
    set(initialState);
  },
});

export const handleAsyncAction = async <TResult>(
  action: () => Promise<TResult>,
  set: (state: any) => void,
  errorMessage: string,
  isReload: boolean = true,
  loadingKey: string = 'loading',
): Promise<TResult> => {
  if (isReload) {
    set({ [loadingKey]: true });
  }
  try {
    const result = await action();
    return result;
  } catch (error) {
    const message = error instanceof ApiError ? error.message : errorMessage;
    set({ error: message });
    console.error('[handleAsyncAction]', error);
    throw error;
  } finally {
    set({ [loadingKey]: false });
  }
};
