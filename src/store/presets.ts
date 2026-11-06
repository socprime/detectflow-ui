import { api } from '@/models/providers';
import type {
  CreatePresetRequest,
  PaginationParams,
  UpdatePresetRequest,
} from '@/models/providers/Types/Request';
import type { PresetResponse, PresetsResponse } from '@/models/providers/Types/responses/preset';
import type { RuleTemplateSchemaResponse } from '@/models/providers/Types/responses/ruleTemplates';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface PresetsState {
  loading: boolean;
  error: string | null;
  presets: PresetsResponse | null;
  preset: PresetResponse | null;
  schema: RuleTemplateSchemaResponse | null;

  fetchSchema: () => Promise<RuleTemplateSchemaResponse>;
  fetchPreset: (presetId: string) => Promise<PresetResponse>;
  fetchPresets: (params?: PaginationParams) => Promise<PresetsResponse>;
  createPreset: (data: CreatePresetRequest) => Promise<PresetResponse>;
  updatePreset: (presetId: string, data: UpdatePresetRequest) => Promise<PresetResponse>;
  deletePreset: (presetId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  PresetsState,
  | 'fetchSchema'
  | 'fetchPresets'
  | 'fetchPreset'
  | 'createPreset'
  | 'updatePreset'
  | 'deletePreset'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  error: null,
  schema: null,
  presets: null,
  preset: null,
};

export const usePresetsStore = create<PresetsState>((set) => ({
  ...initialState,

  fetchSchema: () =>
    handleAsyncAction(
      async () => {
        const schema = await api.settings.ruleTemplate.presets.getSchema();
        set({ schema });
        return schema;
      },
      set,
      'Failed to fetch schema',
    ),

  fetchPresets: (params) =>
    handleAsyncAction(
      async () => {
        const presets = await api.settings.ruleTemplate.presets.getList(params);
        set({ presets });
        return presets;
      },
      set,
      'Failed to fetch presets list',
    ),

  fetchPreset: (presetId) =>
    handleAsyncAction(
      async () => {
        const preset = await api.settings.ruleTemplate.presets.getById(presetId);
        set({ preset });
        return preset;
      },
      set,
      'Failed to fetch preset',
    ),

  createPreset: (data) =>
    handleAsyncAction(
      async () => api.settings.ruleTemplate.presets.create(data),
      set,
      'Failed to create preset',
    ),

  updatePreset: (presetId, data) =>
    handleAsyncAction(
      async () => api.settings.ruleTemplate.presets.update(presetId, data),
      set,
      'Failed to update preset',
    ),

  deletePreset: (presetId) =>
    handleAsyncAction(
      async () => api.settings.ruleTemplate.presets.delete(presetId),
      set,
      'Failed to delete filter',
    ),

  ...createBaseActions(initialState, set),
}));
