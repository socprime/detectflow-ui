import { create } from 'zustand';
import { api } from '../models/providers';
import type {
  CreateFilterRequest,
  PaginationParams,
  UpdateFilterRequest,
} from '../models/providers/Types/Request';
import type {
  ActiveFilterResponse,
  FilterResponse,
  FiltersResponse,
  StatusResponse,
} from '../models/providers/Types/Response';
import { createBaseActions, handleAsyncAction } from './middleware';

interface FiltersState {
  loading: boolean;
  error: string | null;
  activeFilters: ActiveFilterResponse[];
  filters: FiltersResponse | null;
  filter: FilterResponse | null;

  fetchFilter: (filterId: string) => Promise<FilterResponse>;
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

  createFilter: (data) =>
    handleAsyncAction(
      async () => await api.settings.filters.create(data),
      set,
      'Failed to create filter',
    ),

  updateFilter: (filterId, data) =>
    handleAsyncAction(
      async () => await api.settings.filters.update(filterId, data),
      set,
      'Failed to update filter',
    ),

  deleteFilter: (filterId) =>
    handleAsyncAction(
      async () => await api.settings.filters.delete(filterId),
      set,
      'Failed to delete filter',
    ),

  ...createBaseActions(initialState, set),
}));
