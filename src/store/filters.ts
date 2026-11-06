import { api, ApiError } from '@/models/providers';
import type {
  CreateFilterRequest,
  PaginationParams,
  UpdateFilterRequest,
} from '@/models/providers/Types/Request';
import type { StatusResponse } from '@/models/providers/Types/responses/common';
import type {
  ActiveFilterResponse,
  FilterResponse,
  FiltersResponse,
} from '@/models/providers/Types/responses/filters';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface FiltersState {
  loading: boolean;
  error: string | null;
  activeFilters: ActiveFilterResponse[];
  filters: FiltersResponse | null;
  filter: FilterResponse | null;

  fetchFilter: (filterId: string) => Promise<FilterResponse>;
  fetchFilterIfExists: (filterId: string) => Promise<FilterResponse | null>;
  fetchActiveFilters: () => Promise<ActiveFilterResponse[]>;
  fetchFilters: (params?: PaginationParams) => Promise<FiltersResponse>;
  createFilter: (data: CreateFilterRequest) => Promise<StatusResponse>;
  updateFilter: (filterId: string, data: UpdateFilterRequest) => Promise<StatusResponse>;
  deleteFilter: (filterId: string) => Promise<StatusResponse>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  FiltersState,
  | 'fetchActiveFilters'
  | 'fetchFilters'
  | 'fetchFilter'
  | 'fetchFilterIfExists'
  | 'createFilter'
  | 'updateFilter'
  | 'deleteFilter'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  error: null,
  activeFilters: [],
  filters: null,
  filter: null,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initialState,

  fetchActiveFilters: () =>
    handleAsyncAction(
      async () => {
        const activeFilters = await api.settings.filters.getActive();
        set({ activeFilters });
        return activeFilters;
      },
      set,
      'Failed to fetch active filters',
    ),

  fetchFilters: (params) =>
    handleAsyncAction(
      async () => {
        const filters = await api.settings.filters.getList(params);
        set({ filters });
        return filters;
      },
      set,
      'Failed to fetch filters list',
    ),

  fetchFilter: (filterId) =>
    handleAsyncAction(
      async () => {
        const filter = await api.settings.filters.getById(filterId);
        set({ filter });
        return filter;
      },
      set,
      'Failed to fetch filter',
    ),

  fetchFilterIfExists: async (filterId) => {
    set({ loading: true });

    try {
      return await api.settings.filters.getById(filterId);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      const message = error instanceof ApiError ? error.message : 'Failed to fetch filter';
      set({ error: message });
      console.error('[fetchFilterIfExists]', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createFilter: (data) =>
    handleAsyncAction(
      async () => api.settings.filters.create(data),
      set,
      'Failed to create filter',
    ),

  updateFilter: (filterId, data) =>
    handleAsyncAction(
      async () => api.settings.filters.update(filterId, data),
      set,
      'Failed to update filter',
    ),

  deleteFilter: (filterId) =>
    handleAsyncAction(
      async () => api.settings.filters.delete(filterId),
      set,
      'Failed to delete filter',
    ),

  ...createBaseActions(initialState, set),
}));
