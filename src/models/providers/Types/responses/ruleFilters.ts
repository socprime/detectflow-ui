import type { PaginatedResponse } from './common';

export interface RuleFilter {
  id: string;
  name: string;
  user_id: string;
  siem_type: string;
  siem_name: string;
  filter_body: string;
  created: string;
  updated: string;
  append_to_rule: boolean;
}

export interface RuleFiltersResponse extends PaginatedResponse<RuleFilter> {}

export interface RuleFilterResponse extends RuleFilter {}

export interface ApplyFiltersResponse {
  updated_rule: string;
  error: string;
  status: boolean;
}
