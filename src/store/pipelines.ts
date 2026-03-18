import { create } from 'zustand';
import { api } from '../models/providers/';
import type {
  CreatePipelineRequest,
  PaginationParams,
  UpdatePipelineRequest,
} from '../models/providers/Types/Request';
import type {
  PipelineResponse,
  PipelineRulesResponse,
  PipelinesResponse,
  PipelineStatisticsResponse,
  StatusResponse,
} from '../models/providers/Types/Response';
import { createBaseActions, handleAsyncAction } from './middleware';

interface PipelinesState {
  loading: boolean;
  loadingRules: boolean;
  error: string | null;
  pipelineStatistics: PipelineStatisticsResponse | null;
  pipelines: PipelinesResponse | null;
  pipeline: PipelineResponse | null;
  pipelineRules: PipelineRulesResponse | null;

  fetchPipelines: (params?: PaginationParams, withLoading?: boolean) => Promise<PipelinesResponse>;
  fetchPipelineById: (pipelineId: string, withLoading?: boolean) => Promise<PipelineResponse>;
  fetchPipelineRules: (
    pipelineId: string,
    params?: PaginationParams,
    withLoading?: boolean,
  ) => Promise<PipelineRulesResponse>;
  createPipeline: (data: CreatePipelineRequest) => Promise<StatusResponse>;
  updatePipeline: (
    pipelineId: string,
    data: UpdatePipelineRequest,
    withLoading?: boolean,
  ) => Promise<StatusResponse>;
  deletePipeline: (pipelineId: string) => Promise<StatusResponse>;
  updatePipelineRule: (
    pipelineId: string,
    ruleId: string,
    status: 'enable' | 'disable',
    withLoading?: boolean,
  ) => Promise<StatusResponse>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  PipelinesState,
  | 'fetchPipelines'
  | 'fetchPipelineById'
  | 'createPipeline'
  | 'updatePipeline'
  | 'deletePipeline'
  | 'fetchPipelineRules'
  | 'updatePipelineRule'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  loadingRules: false,
  error: '',
  pipelineStatistics: null,
  pipelines: {
    data: [],
    total: 0,
    limit: 0,
    offset: 0,
    sort: '',
    order: '',
    page: 1,
  },
  pipeline: null,
  pipelineRules: null,
};

export const usePipelinesStore = create<PipelinesState>((set, get) => ({
  ...initialState,

  fetchPipelines: async (params, withLoading = true) =>
    handleAsyncAction(
      async () => {
        const pipelines = await api.pipelines.getList(params);
        set({ pipelines });
        return pipelines;
      },
      set,
      'Failed to fetch pipelines list',
      withLoading,
    ),

  fetchPipelineById: async (pipelineId, withLoading = true) =>
    handleAsyncAction(
      async () => {
        const pipeline = await api.pipelines.getById(pipelineId);
        set({ pipeline });
        return pipeline;
      },
      set,
      'Failed to fetch pipeline details',
      withLoading,
    ),

  createPipeline: async (data) =>
    handleAsyncAction(
      async () => await api.pipelines.create(data),
      set,
      'Failed to create pipeline',
    ),

  updatePipeline: async (pipelineId, data, withLoading = true) =>
    handleAsyncAction(
      async () => await api.pipelines.update(pipelineId, data),
      set,
      'Failed to update pipeline',
      withLoading,
    ),

  deletePipeline: async (pipelineId) =>
    handleAsyncAction(
      async () => await api.pipelines.delete(pipelineId),
      set,
      'Failed to delete pipeline',
    ),

  fetchPipelineRules: async (pipelineId, params, withLoading = true) =>
    handleAsyncAction(
      async () => {
        const pipelineRules = await api.pipelines.getDetailsRules(pipelineId, params);
        set({ pipelineRules });
        return pipelineRules;
      },
      set,
      'Failed to fetch pipeline rules',
      withLoading,
      'loadingRules',
    ),

  updatePipelineRule: async (pipelineId, ruleId, status, withLoading = true) =>
    handleAsyncAction(
      async () => await api.pipelines.updateRuleStatus(pipelineId, ruleId, status),
      set,
      'Failed to update pipeline rule',
      withLoading,
      'loadingRules',
    ),

  ...createBaseActions(initialState, set),
}));
