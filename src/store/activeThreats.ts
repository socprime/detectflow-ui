import { api } from '@/models/providers';
import type {
  ActiveThreatBlockedRequest,
  ActiveThreatPipelineMonitoringRequest,
  ActiveThreatsBulkRequest,
  ActiveThreatsParams,
} from '@/models/providers/Types/Request';
import type {
  ActiveThreatBlockedResponse,
  ActiveThreatBulkResponse,
  ActiveThreatDetail,
  ActiveThreatPipelineMonitoringResponse,
  ActiveThreatRefreshResponse,
  ActiveThreatsResponse,
} from '@/models/providers/Types/responses/activeThreats';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface ActiveThreatsState {
  loading: boolean;
  error: string | null;
  list: ActiveThreatsResponse | null;
  detail: ActiveThreatDetail | null;

  fetchList: (
    params?: ActiveThreatsParams,
    withLoading?: boolean,
  ) => Promise<ActiveThreatsResponse>;
  fetchById: (threatId: string, withLoading?: boolean) => Promise<ActiveThreatDetail>;
  bulkEnable: (
    data: ActiveThreatsBulkRequest,
    withLoading?: boolean,
  ) => Promise<ActiveThreatBulkResponse>;
  bulkDisable: (
    data: ActiveThreatsBulkRequest,
    withLoading?: boolean,
  ) => Promise<ActiveThreatBulkResponse>;
  setPipelineMonitoring: (
    threatId: string,
    correlationPipelineId: string,
    data: ActiveThreatPipelineMonitoringRequest,
    withLoading?: boolean,
  ) => Promise<ActiveThreatPipelineMonitoringResponse>;
  setBlocked: (
    threatId: string,
    data: ActiveThreatBlockedRequest,
    withLoading?: boolean,
  ) => Promise<ActiveThreatBlockedResponse>;
  refresh: (withLoading?: boolean) => Promise<ActiveThreatRefreshResponse>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  ActiveThreatsState,
  | 'fetchList'
  | 'fetchById'
  | 'bulkEnable'
  | 'bulkDisable'
  | 'setPipelineMonitoring'
  | 'setBlocked'
  | 'refresh'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  error: null,
  list: null,
  detail: null,
};

export const useActiveThreatsStore = create<ActiveThreatsState>((set) => ({
  ...initialState,

  fetchList: async (params, withLoading = true) =>
    handleAsyncAction(
      async () => {
        const list = await api.activeThreats.getList(params);
        set({ list });
        return list;
      },
      set,
      'Failed to fetch active threats',
      withLoading,
    ),

  fetchById: async (threatId, withLoading = true) =>
    handleAsyncAction(
      async () => {
        const detail = await api.activeThreats.getById(threatId);
        set({ detail });
        return detail;
      },
      set,
      'Failed to fetch active threat details',
      withLoading,
    ),

  bulkEnable: async (data, withLoading = true) =>
    handleAsyncAction(
      async () => api.activeThreats.bulkEnable(data),
      set,
      'Failed to enable active threats',
      withLoading,
    ),

  bulkDisable: async (data, withLoading = true) =>
    handleAsyncAction(
      async () => api.activeThreats.bulkDisable(data),
      set,
      'Failed to disable active threats',
      withLoading,
    ),

  setPipelineMonitoring: async (threatId, correlationPipelineId, data, withLoading = true) =>
    handleAsyncAction(
      async () => api.activeThreats.setPipelineMonitoring(threatId, correlationPipelineId, data),
      set,
      'Failed to update threat pipeline monitoring',
      withLoading,
    ),

  setBlocked: async (threatId, data, withLoading = true) =>
    handleAsyncAction(
      async () => api.activeThreats.setBlocked(threatId, data),
      set,
      'Failed to update threat block status',
      withLoading,
    ),

  refresh: async (withLoading = true) =>
    handleAsyncAction(
      async () => api.activeThreats.refresh(),
      set,
      'Failed to start active threats refresh',
      withLoading,
    ),

  ...createBaseActions(initialState, set),
}));
