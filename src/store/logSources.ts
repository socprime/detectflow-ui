import { create } from 'zustand';
import { api } from '../models/providers';
import type {
  CreateLogSourceRequest,
  GenerateMappingPromptRequest,
  GenerateMappingRequest,
  PaginationParams,
  RunPreviewParseTestRequest,
  RunTransformTestRequest,
  SigmaFieldsRequest,
  UpdateLogSourceRequest,
} from '../models/providers/Types/Request';
import type {
  GenerateMappingPromptResponse,
  GenerateMappingResponse,
  LogSource,
  LogSourceResponse,
  LogSourcesResponse,
  RunPreviewParseTestResponse,
  RunTransformTestResponse,
  SigmaFieldsResponse,
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
  sigmaFields: SigmaFieldsResponse | null;

  fetchSigmaFields: (params: SigmaFieldsRequest) => Promise<SigmaFieldsResponse>;
  runTransformTest: (data: RunTransformTestRequest) => Promise<RunTransformTestResponse>;
  runPreviewParseTest: (data: RunPreviewParseTestRequest) => Promise<RunPreviewParseTestResponse>;
  generateMapping: (data: GenerateMappingRequest) => Promise<GenerateMappingResponse>;
  generateMappingPrompt: (
    data: GenerateMappingPromptRequest,
  ) => Promise<GenerateMappingPromptResponse>;
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
  sigmaFields: null,
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

  fetchSigmaFields: (params) =>
    handleAsyncAction(
      async () => {
        const sigmaFields = await api.settings.mapping.getSigmaFields(params);
        set({ sigmaFields });
        return sigmaFields;
      },
      set,
      'Failed to fetch sigma fields',
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

  generateMapping: (data) =>
    handleAsyncAction(
      async () => {
        const result = await api.settings.mapping.generateMapping(data);
        return result;
      },
      set,
      'Failed to generate mapping',
    ),
  generateMappingPrompt: (data) =>
    handleAsyncAction(
      async () => {
        const result = await api.settings.mapping.generateMappingPrompt(data);
        return result;
      },
      set,
      'Failed to generate mapping prompt',
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
