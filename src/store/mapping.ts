import { create } from 'zustand';
import { api } from '../models/providers';
import type {
  GenerateMappingPromptRequest,
  GenerateMappingRequest,
  SigmaFieldsRequest,
} from '../models/providers/Types/Request';
import type {
  GenerateMappingPromptResponse,
  GenerateMappingResponse,
  MappingStatusResponse,
  SigmaFieldsResponse,
} from '../models/providers/Types/Response';
import { createBaseActions, handleAsyncAction } from './middleware';

interface MappingState {
  loading: boolean;
  loadingSigmaFields: boolean;
  loadingMappingPrompt: boolean;
  sigmaFields: SigmaFieldsResponse | null;
  mappingStatus: MappingStatusResponse | null;
  error: string | null;

  fetchSigmaFields: (params: SigmaFieldsRequest) => Promise<SigmaFieldsResponse>;
  generateMapping: (data: GenerateMappingRequest) => Promise<GenerateMappingResponse>;
  generateMappingPrompt: (
    data: GenerateMappingPromptRequest,
  ) => Promise<GenerateMappingPromptResponse>;
  getMappingStatus: (jobId: string) => Promise<MappingStatusResponse>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  MappingState,
  | 'generateMapping'
  | 'generateMappingPrompt'
  | 'fetchSigmaFields'
  | 'getMappingStatus'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  loadingSigmaFields: false,
  loadingMappingPrompt: false,
  sigmaFields: null,
  mappingStatus: null,
  error: null,
};

export const useMappingStore = create<MappingState>((set) => ({
  ...initialState,

  fetchSigmaFields: (params) =>
    handleAsyncAction(
      async () => {
        const sigmaFields = await api.settings.mapping.getSigmaFields(params);
        set({ sigmaFields });
        return sigmaFields;
      },
      set,
      'Failed to fetch sigma fields',
      true,
      'loadingSigmaFields',
    ),

  generateMapping: (data) =>
    handleAsyncAction(
      async () => await api.settings.mapping.generateMapping(data),
      set,
      'Failed to generate mapping',
    ),

  generateMappingPrompt: (data) =>
    handleAsyncAction(
      async () => await api.settings.mapping.generateMappingPrompt(data),
      set,
      'Failed to generate mapping prompt',
      true,
      'loadingMappingPrompt',
    ),

  getMappingStatus: (jobId) =>
    handleAsyncAction(
      async () => await api.settings.mapping.getMappingStatus(jobId),
      set,
      'Failed to get mapping status',
    ),

  ...createBaseActions(initialState, set),
}));
