import { create } from 'zustand';
import { api } from '../models/providers';
import type {
  BulkCreateRulesRequest,
  CreateRuleRequest,
  RulesRequest,
  UpdateRuleRequest,
} from '../models/providers/Types/Request';
import type {
  BulkCreateRulesResponse,
  RuleDetailsResponse,
  RulesResponse,
  StatusResponse,
} from '../models/providers/Types/Response';
import { createBaseActions, handleAsyncAction } from './middleware';

interface RulesState {
  loading: boolean;
  error: string | null;
  rules: RulesResponse | null;
  ruleDetails: RuleDetailsResponse | null;

  fetchRules: (params?: RulesRequest) => Promise<RulesResponse>;
  fetchRuleById: (ruleId: string) => Promise<RuleDetailsResponse>;
  createRule: (repositoryId: string, data: CreateRuleRequest) => Promise<StatusResponse>;
  createRulesBulk: (
    repositoryId: string,
    data: BulkCreateRulesRequest,
  ) => Promise<BulkCreateRulesResponse>;
  updateRule: (ruleId: string, data: UpdateRuleRequest) => Promise<StatusResponse>;
  deleteRule: (ruleId: string) => Promise<StatusResponse>;
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

  fetchRuleById: (ruleId) =>
    handleAsyncAction(
      async () => {
        const ruleDetails = await api.settings.rules.getById(ruleId);
        set({ ruleDetails });
        return ruleDetails;
      },
      set,
      'Failed to fetch rule details',
    ),

  createRule: (repositoryId, data) =>
    handleAsyncAction(
      async () => await api.settings.rules.create(repositoryId, data),
      set,
      'Failed to create rule',
      false,
    ),

  createRulesBulk: (repositoryId, data) =>
    handleAsyncAction(
      async () => await api.settings.rules.createBulk(repositoryId, data),
      set,
      'Failed to bulk create rules',
      false,
    ),

  updateRule: (ruleId, data) =>
    handleAsyncAction(
      async () => await api.settings.rules.update(ruleId, data),
      set,
      'Failed to update rule',
    ),

  deleteRule: (ruleId) =>
    handleAsyncAction(
      async () => await api.settings.rules.delete(ruleId),
      set,
      'Failed to delete rule',
    ),

  ...createBaseActions(initialState, set),
}));
