import { create } from 'zustand';
import { api } from '../models/providers';
import type {
  HealthCheckPlatforms,
  HealthCheckResponse,
  HealthCheckVersionResponse,
} from '../models/providers/Types/Response';
import { createBaseActions, handleAsyncAction } from './middleware';

interface SystemStatusState {
  loading: boolean;
  error: string | null;
  platforms: HealthCheckPlatforms[] | null;
  versions: HealthCheckVersionResponse | null;

  fetchHealthCheck: () => Promise<HealthCheckResponse>;
  fetchHealthCheckNow: () => Promise<HealthCheckResponse>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  SystemStatusState,
  'fetchHealthCheck' | 'fetchHealthCheckNow' | 'clearError' | 'reset'
> = {
  loading: false,
  error: null,
  platforms: null,
  versions: null,
};

export const useSystemStatusStore = create<SystemStatusState>((set) => ({
  ...initialState,

  fetchHealthCheck: () =>
    handleAsyncAction(
      async () => {
        const response = await api.settings.healthCheck.getAll();
        set({ platforms: response.platforms, versions: response.versions });
        return response;
      },
      set,
      'Failed to fetch health check',
    ),

  fetchHealthCheckNow: () =>
    handleAsyncAction(
      async () => {
        const response = await api.settings.healthCheck.checkNowAll();
        set({ platforms: response.platforms, versions: response.versions });
        return response;
      },
      set,
      'Failed to fetch health check now',
    ),

  ...createBaseActions(initialState, set),
}));
