import { api } from '@/models/providers';
import type {
  BulkCreateRulesRequest,
  CreateRuleRequest,
  DeleteRuleParams,
  RuleDetailsRequest,
  RulesRequest,
  UpdateRuleParams,
  UpdateRuleRequest,
} from '@/models/providers/Types/Request';
import type { StatusResponse } from '@/models/providers/Types/responses/common';
import type {
  BulkCreateRulesResponse,
  RuleDetailsResponse,
  RulesResponse,
} from '@/models/providers/Types/responses/rules';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface RulesState {
  loading: boolean;
  error: string | null;
  rules: RulesResponse | null;
  ruleDetails: RuleDetailsResponse | null;

  fetchRules: (params?: RulesRequest) => Promise<RulesResponse>;
  fetchRuleById: (
    ruleId: string,
    params?: RuleDetailsRequest,
  ) => Promise<RuleDetailsResponse>;
  createRule: (repositoryId: string, data: CreateRuleRequest) => Promise<StatusResponse>;
  createRulesBulk: (
    repositoryId: string,
    data: BulkCreateRulesRequest,
  ) => Promise<BulkCreateRulesResponse>;
  updateRule: (
    ruleId: string,
    data: UpdateRuleRequest,
    params?: UpdateRuleParams,
  ) => Promise<RuleDetailsResponse>;
  deleteRule: (ruleId: string, params?: DeleteRuleParams) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  RulesState,
  | 'fetchRules'
  | 'fetchRuleById'
  | 'createRule'
  | 'createRulesBulk'
  | 'updateRule'
  | 'deleteRule'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  error: null,
  rules: null,
  ruleDetails: null,
};

export const useRulesStore = create<RulesState>((set, get) => ({
  ...initialState,

  fetchRules: (params) =>
    handleAsyncAction(
      async () => {
        const rules = await api.settings.rules.getList(params);
        set({ rules });
        return rules;
      },
      set,
      'Failed to fetch rules list',
    ),

  fetchRuleById: (ruleId, params) =>
    handleAsyncAction(
      async () => {
        const ruleDetails = await api.settings.rules.getById(ruleId, params);
        set({ ruleDetails });
        return ruleDetails;
      },
      set,
      'Failed to fetch rule details',
    ),

  createRule: (repositoryId, data) =>
    handleAsyncAction(
      async () => api.settings.rules.create(repositoryId, data),
      set,
      'Failed to create rule',
      false,
    ),

  createRulesBulk: (repositoryId, data) =>
    handleAsyncAction(
      async () => api.settings.rules.createBulk(repositoryId, data),
      set,
      'Failed to bulk create rules',
      false,
    ),

  updateRule: (ruleId, data, params) =>
    handleAsyncAction(
      async () => api.settings.rules.update(ruleId, data, params),
      set,
      'Failed to update rule',
    ),

  deleteRule: (ruleId, params) =>
    handleAsyncAction(
      async () => api.settings.rules.delete(ruleId, params),
      set,
      'Failed to delete rule',
    ),

  ...createBaseActions(initialState, set),
}));
