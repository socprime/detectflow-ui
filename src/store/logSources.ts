import { create } from 'zustand';
import { api } from '../models/providers';
import type {
  CreateLogSourceRequest,
  PaginationParams,
  RunPreviewParseTestRequest,
  RunTransformTestRequest,
  UpdateLogSourceRequest,
} from '../models/providers/Types/Request';
import type {
  LogSource,
  LogSourceResponse,
  LogSourcesResponse,
  RunPreviewParseTestResponse,
  RunTransformTestResponse,
  StatusResponse,
} from '../models/providers/Types/Response';
import { createBaseActions, handleAsyncAction } from './middleware';

interface LogSourcesState {
  loading: boolean;
  error: string | null;
  logSources: LogSourcesResponse;
  logSource: LogSource | null;
  transformTestResult: RunTransformTestResponse | null;
  previewParseTestResult: RunPreviewParseTestResponse | null;

  runTransformTest: (data: RunTransformTestRequest) => Promise<RunTransformTestResponse>;
  runPreviewParseTest: (data: RunPreviewParseTestRequest) => Promise<RunPreviewParseTestResponse>;
  fetchLogSources: (params?: PaginationParams) => Promise<LogSourcesResponse>;
  fetchLogSourceById: (logSourceId: string) => Promise<LogSourceResponse>;
  createLogSource: (data: CreateLogSourceRequest) => Promise<StatusResponse>;
  updateLogSource: (logSourceId: string, data: UpdateLogSourceRequest) => Promise<StatusResponse>;
  deleteLogSource: (logSourceId: string) => Promise<StatusResponse>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  LogSourcesState,
  | 'runTransformTest'
  | 'runPreviewParseTest'
  | 'generateMapping'
  | 'generateMappingPrompt'
  | 'fetchLogSources'
  | 'fetchLogSourceById'
  | 'createLogSource'
  | 'updateLogSource'
  | 'deleteLogSource'
  | 'fetchSigmaFields'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  error: null,
  logSources: {
    total: 0,
    limit: 0,
    offset: 0,
    page: 1,
    order: 'desc',
    sort: 'created',
    data: [],
  },
  logSource: null,
  transformTestResult: null,
  previewParseTestResult: null,
};

export const useLogSourcesStore = create<LogSourcesState>((set, get) => ({
  ...initialState,

  fetchLogSources: (params) =>
    handleAsyncAction(
      async () => {
        const logSources = await api.settings.logSources.getList(params);
        set({ logSources });
        return logSources;
      },
      set,
      'Failed to fetch log sources',
    ),

  runTransformTest: (data) =>
    handleAsyncAction(
      async () => {
        const transformTestResult = await api.settings.logSources.runTransformTest(data);
        set({ transformTestResult });
        return transformTestResult;
      },
      set,
      'Failed to run transform test',
    ),

  runPreviewParseTest: (data) =>
    handleAsyncAction(
      async () => {
        const previewParseTestResult = await api.settings.logSources.runPreviewParseTest(data);
        set({ previewParseTestResult });
        return previewParseTestResult;
      },
      set,
      'Failed to run preview parse test',
    ),

  fetchLogSourceById: (logSourceId) =>
    handleAsyncAction(
      async () => {
        const logSource = await api.settings.logSources.getById(logSourceId);
        set({ logSource });
        return logSource;
      },
      set,
      'Failed to fetch log source',
    ),

  createLogSource: (data) =>
    handleAsyncAction(
      async () => await api.settings.logSources.create(data),
      set,
      'Failed to create log source',
    ),

  updateLogSource: (logSourceId, data) =>
    handleAsyncAction(
      async () => await api.settings.logSources.update(logSourceId, data),
      set,
      'Failed to update log source',
    ),

  deleteLogSource: (logSourceId) =>
    handleAsyncAction(
      async () => await api.settings.logSources.delete(logSourceId),
      set,
      'Failed to delete log source',
    ),

  ...createBaseActions(initialState, set),
}));
