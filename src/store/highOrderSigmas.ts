import { api } from '@/models/providers';
import type {
  HighOrderSigmasRequest,
  UpdateHighOrderSigmaRequest,
} from '@/models/providers/Types/Request';
import type {
  HighOrderSigma,
  HighOrderSigmasResponse,
} from '@/models/providers/Types/responses/highOrderSigma';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface HighOrderSigmasState {
  loading: boolean;
  error: string | null;
  list: HighOrderSigmasResponse | null;
  detail: HighOrderSigma | null;

  fetchList: (
    params?: HighOrderSigmasRequest,
    withLoading?: boolean,
  ) => Promise<HighOrderSigmasResponse>;
  fetchById: (id: string, withLoading?: boolean) => Promise<HighOrderSigma>;
  update: (id: string, data: UpdateHighOrderSigmaRequest) => Promise<HighOrderSigma>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  HighOrderSigmasState,
  'fetchList' | 'fetchById' | 'update' | 'clearError' | 'reset'
> = {
  loading: false,
  error: null,
  list: null,
  detail: null,
};

export const useHighOrderSigmasStore = create<HighOrderSigmasState>((set) => ({
  ...initialState,

  fetchList: async (params, withLoading = true) =>
    handleAsyncAction(
      async () => {
        const list = await api.highOrderSigmas.getList(params);
        set({ list });
        return list;
      },
      set,
      'Failed to fetch high order sigmas',
      withLoading,
    ),

  fetchById: async (id, withLoading = true) =>
    handleAsyncAction(
      async () => {
        const detail = await api.highOrderSigmas.getById(id);
        set({ detail });
        return detail;
      },
      set,
      'Failed to fetch high order sigma details',
      withLoading,
    ),

  update: async (id, data) =>
    handleAsyncAction(
      async () => {
        const detail = await api.highOrderSigmas.update(id, data);
        set({ detail });
        return detail;
      },
      set,
      'Failed to update high order sigma',
      false,
    ),

  ...createBaseActions(initialState, set),
}));
