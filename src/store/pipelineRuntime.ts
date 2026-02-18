import { create } from 'zustand';
import { api } from '../models/providers';
import type { UpdatePipelineRuntimeRequest } from '../models/providers/Types/Request';
import type {
  IPipelineRuntimeResponse,
  PipelineRuntimeSchemaResponse,
  StatusResponse,
} from '../models/providers/Types/Response';
import { createBaseActions, handleAsyncAction } from './middleware';

interface PipelineRuntimeState {
  loading: boolean;
  error: string | null;
  pipelineRuntime: IPipelineRuntimeResponse | null;
  pipelineRuntimeSchema: PipelineRuntimeSchemaResponse | null;

  fetchPipelineRuntime: () => Promise<IPipelineRuntimeResponse>;
  fetchPipelineRuntimeSchema: () => Promise<PipelineRuntimeSchemaResponse>;
  updatePipelineRuntime: (data: UpdatePipelineRuntimeRequest) => Promise<StatusResponse>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  PipelineRuntimeState,
  | 'fetchPipelineRuntime'
  | 'fetchPipelineRuntimeSchema'
  | 'updatePipelineRuntime'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  error: '',
  pipelineRuntime: null,
  pipelineRuntimeSchema: null,
};

export const usePipelineRuntimeStore = create<PipelineRuntimeState>((set) => ({
  ...initialState,

  fetchPipelineRuntime: async () =>
    handleAsyncAction(
      async () => {
        const pipelineRuntime = await api.settings.pipelineRuntime.get();
        set({ pipelineRuntime });
        return pipelineRuntime;
      },
      set,
      'Failed to fetch pipeline runtime',
    ),

  fetchPipelineRuntimeSchema: async () =>
    handleAsyncAction(
      async () => {
        const pipelineRuntimeSchema = await api.settings.pipelineRuntime.getSchema();
        set({ pipelineRuntimeSchema });
        return pipelineRuntimeSchema;
      },
      set,
      'Failed to fetch pipeline runtime schema',
    ),

  updatePipelineRuntime: async (data) =>
    handleAsyncAction(
      async () => await api.settings.pipelineRuntime.update(data),
      set,
      'Failed to update pipeline runtime',
    ),

  ...createBaseActions(initialState, set),
}));
