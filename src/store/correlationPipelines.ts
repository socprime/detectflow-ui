import { api } from '@/models/providers';
import type {
  CorrelationPipelinesParams,
  CreateCorrelationPipelineRequest,
  UpdateCorrelationPipelineParams,
  UpdateCorrelationPipelineRequest,
} from '@/models/providers/Types/Request';
import type {
  CorrelationPipelineDetail,
  CorrelationPipelineMutationResponse,
  CorrelationPipelineRunStopResponse,
  CorrelationPipelinesResponse,
} from '@/models/providers/Types/responses/correlationPipelines';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface CorrelationPipelinesState {
  loading: boolean;
  error: string | null;
  list: CorrelationPipelinesResponse | null;
  detail: CorrelationPipelineDetail | null;

  fetchList: (
    params?: CorrelationPipelinesParams,
    withLoading?: boolean,
  ) => Promise<CorrelationPipelinesResponse>;
  fetchById: (pipelineId: string, withLoading?: boolean) => Promise<CorrelationPipelineDetail>;
  create: (
    data: CreateCorrelationPipelineRequest,
    withLoading?: boolean,
  ) => Promise<CorrelationPipelineMutationResponse>;
  update: (
    pipelineId: string,
    data: UpdateCorrelationPipelineRequest,
    params?: UpdateCorrelationPipelineParams,
    withLoading?: boolean,
  ) => Promise<CorrelationPipelineMutationResponse>;
  remove: (pipelineId: string, withLoading?: boolean) => Promise<void>;
  duplicate: (
    pipelineId: string,
    withLoading?: boolean,
  ) => Promise<CorrelationPipelineMutationResponse>;
  run: (pipelineId: string, withLoading?: boolean) => Promise<CorrelationPipelineRunStopResponse>;
  stop: (pipelineId: string, withLoading?: boolean) => Promise<CorrelationPipelineRunStopResponse>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  CorrelationPipelinesState,
  | 'fetchList'
  | 'fetchById'
  | 'create'
  | 'update'
  | 'remove'
  | 'duplicate'
  | 'run'
  | 'stop'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  error: null,
  list: null,
  detail: null,
};

export const useCorrelationPipelinesStore = create<CorrelationPipelinesState>((set) => ({
  ...initialState,

  fetchList: async (params, withLoading = true) =>
    handleAsyncAction(
      async () => {
        const list = await api.correlationPipelines.getList(params);
        set({ list });
        return list;
      },
      set,
      'Failed to fetch correlation pipelines',
      withLoading,
    ),

  fetchById: async (pipelineId, withLoading = true) =>
    handleAsyncAction(
      async () => {
        const detail = await api.correlationPipelines.getById(pipelineId);
        set({ detail });
        return detail;
      },
      set,
      'Failed to fetch correlation pipeline details',
      withLoading,
    ),

  create: async (data, withLoading = true) =>
    handleAsyncAction(
      async () => api.correlationPipelines.create(data),
      set,
      'Failed to create correlation pipeline',
      withLoading,
    ),

  update: async (pipelineId, data, params, withLoading = true) =>
    handleAsyncAction(
      async () => api.correlationPipelines.update(pipelineId, data, params),
      set,
      'Failed to update correlation pipeline',
      withLoading,
    ),

  remove: async (pipelineId, withLoading = true) =>
    handleAsyncAction(
      async () => api.correlationPipelines.delete(pipelineId),
      set,
      'Failed to delete correlation pipeline',
      withLoading,
    ),

  duplicate: async (pipelineId, withLoading = true) =>
    handleAsyncAction(
      async () => api.correlationPipelines.duplicate(pipelineId),
      set,
      'Failed to duplicate correlation pipeline',
      withLoading,
    ),

  run: async (pipelineId, withLoading = true) =>
    handleAsyncAction(
      async () => api.correlationPipelines.run(pipelineId),
      set,
      'Failed to run correlation pipeline',
      withLoading,
    ),

  stop: async (pipelineId, withLoading = true) =>
    handleAsyncAction(
      async () => api.correlationPipelines.stop(pipelineId),
      set,
      'Failed to stop correlation pipeline',
      withLoading,
    ),

  ...createBaseActions(initialState, set),
}));
