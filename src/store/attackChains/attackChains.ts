import { attackChainsSSEConfig } from '@/config/sse';
import { api } from '@/models/providers';
import type {
  AttackChainsParams,
  UpdateAttackChainRequest,
} from '@/models/providers/Types/Request';
import type {
  AttackChainDetailResponse,
  AttackChainsPageFiltersResponse,
  AttackChainsResponse,
} from '@/models/providers/Types/responses/attackChains';
import { InvalidationSSEManager } from '@/services/sse';
import { normalizeAttackChainDetail } from '@/store/attackChains/utils';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface AttackChainsState {
  loading: boolean;
  loadingStatus: boolean;
  error: string | null;
  data: AttackChainsResponse | null;
  filters: AttackChainsPageFiltersResponse | null;
  detail: AttackChainDetailResponse | null;
  lastListParams: AttackChainsParams | null;

  fetchList: (params?: AttackChainsParams, withLoading?: boolean) => Promise<AttackChainsResponse>;
  fetchFilters: () => Promise<AttackChainsPageFiltersResponse>;
  fetchById: (chainId: string, withLoading?: boolean) => Promise<AttackChainDetailResponse>;
  updateStatus: (
    chainId: string,
    data: UpdateAttackChainRequest,
  ) => Promise<AttackChainDetailResponse>;
  subscribeLiveUpdates: () => void;
  unsubscribeLiveUpdates: () => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  AttackChainsState,
  | 'fetchList'
  | 'fetchFilters'
  | 'fetchById'
  | 'updateStatus'
  | 'subscribeLiveUpdates'
  | 'unsubscribeLiveUpdates'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  loadingStatus: false,
  error: null,
  data: null,
  filters: null,
  detail: null,
  lastListParams: null,
};

let liveUpdatesManager: InvalidationSSEManager | null = null;
let liveUpdatesSubscriberCount = 0;

const disconnectLiveUpdates = () => {
  if (liveUpdatesManager) {
    liveUpdatesManager.disconnect();
    liveUpdatesManager = null;
  }
};

export const useAttackChainsStore = create<AttackChainsState>((set, get) => ({
  ...initialState,

  fetchList: async (params, withLoading = true) =>
    handleAsyncAction(
      async () => {
        if (params) {
          set({ lastListParams: params });
        }

        const data = await api.attackChains.getList(params);
        set({ data });
        return data;
      },
      set,
      'Failed to fetch attack chains',
      withLoading,
    ),

  fetchFilters: async () =>
    handleAsyncAction(
      async () => {
        const filters = await api.attackChains.getFilters();
        set({ filters });
        return filters;
      },
      set,
      'Failed to fetch attack chains filters',
      false,
    ),

  fetchById: async (chainId, withLoading = true) =>
    handleAsyncAction(
      async () => {
        const detail = normalizeAttackChainDetail(await api.attackChains.getById(chainId));
        set({ detail });
        return detail;
      },
      set,
      'Failed to fetch attack chain details',
      withLoading,
    ),

  updateStatus: async (chainId, data) =>
    handleAsyncAction(
      async () => {
        const detail = normalizeAttackChainDetail(
          await api.attackChains.updateStatus(chainId, data),
        );
        set({ detail });
        return detail;
      },
      set,
      'Failed to update attack chain status',
      true,
      'loadingStatus',
    ),

  subscribeLiveUpdates: () => {
    liveUpdatesSubscriberCount += 1;

    if (liveUpdatesManager || !attackChainsSSEConfig.enabled) {
      return;
    }

    liveUpdatesManager = new InvalidationSSEManager(attackChainsSSEConfig, {
      onInvalidation: () => {
        const { lastListParams, fetchList } = get();
        if (lastListParams) {
          void fetchList(lastListParams, false);
        }
      },
      onError: (error) => {
        console.error('[AttackChains SSE]', error);
        set({ error });
      },
    });
    liveUpdatesManager.connect();
  },

  unsubscribeLiveUpdates: () => {
    liveUpdatesSubscriberCount = Math.max(0, liveUpdatesSubscriberCount - 1);

    if (liveUpdatesSubscriberCount > 0) {
      return;
    }

    disconnectLiveUpdates();
  },

  ...createBaseActions(initialState, set),

  reset: () => {
    liveUpdatesSubscriberCount = 0;
    disconnectLiveUpdates();
    set(initialState);
  },
}));
