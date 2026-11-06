import type { PaginatedResponse } from './common';

export interface RuleTemplateFieldDefinition {
  name: string;
  type: 'string' | 'boolean' | 'string[]';
  title: string;
  description: string;
  options: string[] | null;
}

export interface RuleTemplateBodyParams {
  value: string;
  name: string;
  fields: {
    [key: string]: RuleTemplateFieldDefinition;
  };
}

export type RuleTemplateSchema = {
  [siemType: string]: {
    [key: string]: string;
  };
};

export interface RuleTemplateSchemaResponse {
  body_parameters: RuleTemplateBodyParams[];
  schema: RuleTemplateSchema;
}

export interface ApplyPresetResponse {
  updated_rule: string;
  error: string;
  status: boolean;
}

export type ApplyRuleFilterResponse = ApplyPresetResponse;

export interface RuleTemplateFilter {
  id: string;
  name: string;
  user_id: string;
  siem_type: string;
  filter_body: string;
  created: string;
  updated: string;
}

export interface RuleTemplateFiltersResponse extends PaginatedResponse<RuleTemplateFilter> {}
export interface CreateRuleTemplateFilterResponse extends RuleTemplateFilter {}
export interface RuleTemplateFilterResponse extends RuleTemplateFilter {}
