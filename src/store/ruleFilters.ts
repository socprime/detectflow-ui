import { api, ApiError } from '@/models/providers';
import type {
  ApplyFiltersRequest,
  CreateRuleFilterRequest,
  PaginationParams,
  UpdateRuleFilterRequest,
} from '@/models/providers/Types/Request';
import type {
  ApplyFiltersResponse,
  RuleFilterResponse,
  RuleFiltersResponse,
} from '@/models/providers/Types/responses/ruleFilters';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface RuleFiltersState {
  loading: boolean;
  error: string | null;
  filters: RuleFiltersResponse | null;
  filterDetails: RuleFilterResponse | null;

  fetchFilters: (params?: PaginationParams) => Promise<RuleFiltersResponse>;
  fetchFilterById: (filterId: string) => Promise<RuleFilterResponse>;
  fetchFilterByIdIfExists: (filterId: string) => Promise<RuleFilterResponse | null>;
  createFilter: (data: CreateRuleFilterRequest) => Promise<RuleFilterResponse>;
  updateFilter: (filterId: string, data: UpdateRuleFilterRequest) => Promise<RuleFilterResponse>;
  deleteFilter: (filterId: string) => Promise<void>;
  applyFilters: (data: ApplyFiltersRequest) => Promise<ApplyFiltersResponse>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  RuleFiltersState,
  | 'fetchFilters'
  | 'fetchFilterById'
  | 'fetchFilterByIdIfExists'
  | 'createFilter'
  | 'updateFilter'
  | 'deleteFilter'
  | 'applyFilters'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  error: null,
  filters: null,
  filterDetails: null,
};

export const useRuleFiltersStore = create<RuleFiltersState>((set) => ({
  ...initialState,

  fetchFilters: (params) =>
    handleAsyncAction(
      async () => {
        const filters = await api.settings.ruleTemplate.filters.getList(params);
        set({ filters });
        return filters;
      },
      set,
      'Failed to fetch rule filters',
    ),

  fetchFilterById: (filterId) =>
    handleAsyncAction(
      async () => {
        const filterDetails = await api.settings.ruleTemplate.filters.getById(filterId);
        set({ filterDetails });
        return filterDetails;
      },
      set,
      'Failed to fetch filter details',
    ),

  fetchFilterByIdIfExists: async (filterId) => {
    set({ loading: true });

    try {
      return await api.settings.ruleTemplate.filters.getById(filterId);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      const message = error instanceof ApiError ? error.message : 'Failed to fetch filter details';
      set({ error: message });
      console.error('[fetchFilterByIdIfExists]', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createFilter: (data) =>
    handleAsyncAction(
      async () => {
        const filterResponse = await api.settings.ruleTemplate.filters.create(data);
        set((state) => ({
          filters: state.filters
            ? {
                ...state.filters,
                data: [filterResponse, ...state.filters.data],
              }
            : null,
        }));
        return filterResponse;
      },
      set,
      'Failed to create filter',
      false,
    ),

  updateFilter: (filterId, data) =>
    handleAsyncAction(
      async () => {
        const filterResponse = await api.settings.ruleTemplate.filters.update(filterId, data);
        set((state) => ({
          filters: state.filters
            ? {
                ...state.filters,
                data: state.filters.data.map((f) => (f.id === filterId ? filterResponse : f)),
              }
            : null,
          filterDetails:
            state.filterDetails?.id === filterId ? filterResponse : state.filterDetails,
        }));
        return filterResponse;
      },
      set,
      'Failed to update filter',
    ),

  deleteFilter: (filterId) =>
    handleAsyncAction(
      async () => {
        await api.settings.ruleTemplate.filters.delete(filterId);
        set((state) => ({
          filters: state.filters
            ? {
                ...state.filters,
                data: state.filters.data.filter((f) => f.id !== filterId),
              }
            : null,
          filterDetails: state.filterDetails?.id === filterId ? null : state.filterDetails,
        }));
      },
      set,
      'Failed to delete filter',
    ),

  applyFilters: (data) =>
    handleAsyncAction(
      async () => api.settings.ruleTemplate.applyFilters(data),
      set,
      'Failed to apply filters',
      false,
    ),

  ...createBaseActions(initialState, set),
}));
