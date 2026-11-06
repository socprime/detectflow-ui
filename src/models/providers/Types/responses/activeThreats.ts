import type { RuleCheckResults } from './attackChains';
import type { PaginatedResponse } from './common';
import type { AttackChainsRuntimeStateResponse } from './correlation';

import type { TLevel, TSeverity } from '@/utils';

export interface ActiveThreatPipelineRef {
  id: string;
  name: string;
}

export interface ActiveThreatListItem {
  tdm_id: string;
  name: string;
  is_blocked: boolean;
  severity: TSeverity;
  industries: string[];
  geographies: string[];
  threat_types: string[];
  threat_actors: string[];
  source: string;
  release_date: string;
  is_hidden: boolean;
  pipelines: ActiveThreatPipelineRef[];
  rule_check_results: RuleCheckResults;
}

export interface ActiveThreatsResponse extends PaginatedResponse<ActiveThreatListItem> {}

export type ActiveThreatBulkStatus = 'updated' | 'not_found' | 'blocked';

export interface ActiveThreatBulkResultItem {
  threat_id: string;
  status: ActiveThreatBulkStatus;
}

export interface ActiveThreatBulkResponse {
  results: ActiveThreatBulkResultItem[];
  updated: number;
  not_found: number;
  blocked: number;
  correlation_pipeline_ids: string[];
  pipelines_applied: number;
}

export interface ActiveThreatRefreshResponse {
  message: string;
}

export interface ActiveThreatHighOrderSigma {
  id: string;
  tdm_id: string;
  name: string;
  body: string;
  tdm_created: string;
  tdm_updated: string;
  created: string;
  updated: string;
  is_user_edited: boolean;
  level: TLevel;
}

export interface ActiveThreatRule {
  id: string;
  name: string;
  version: number;
  repository_id: string;
  repository_type: string;
  repository_name: string;
  created: string;
  updated: string;
  product?: string | null;
  service?: string | null;
  category?: string | null;
  is_supported?: boolean;
  unsupported_reason?: string | null;
  rule_check_results_reason?: string;
  level: TLevel;
}

export interface ActiveThreatAttackChainCounts {
  new: number;
  investigating: number;
  confirmed: number;
  false_positive: number;
  resolved: number;
  closed: number;
  filtered_out: number;
}

export interface ActiveThreatPipelineMonitoring {
  correlation_pipeline_id: string;
  name: string;
  jobs_status: string;
  runtime_state: AttackChainsRuntimeStateResponse | null;
  monitored: boolean;
  attack_chains_total: number;
  attack_chain_counts: ActiveThreatAttackChainCounts;
  first_seen: string;
  last_seen: string;
}

export interface ActiveThreatThreatActors {
  id: string;
  name: string;
}

export interface ActiveThreatTechniques {
  id: string;
  name: string;
}

export interface ActiveThreatDetail {
  tdm_id: string;
  name: string;
  is_blocked: boolean;
  summary: string | null;
  severity: TSeverity;
  investigation: string | null;
  response: string | null;
  mitigation: string | null;
  industries: string[];
  geographies: string[];
  threat_types: string[];
  threat_actors: ActiveThreatThreatActors[];
  techniques: ActiveThreatTechniques[];
  source: string;
  attack_flow: string | null;
  is_hidden: boolean;
  tdm_created: string;
  tdm_updated: string;
  created: string;
  updated: string;
  rules: ActiveThreatRule[];
  rule_check_results: RuleCheckResults;
  high_order_sigmas: ActiveThreatHighOrderSigma[];
  pipelines: ActiveThreatPipelineMonitoring[];
  rule_check_results_count: number;
}

export interface ActiveThreatPipelineMonitoringResponse {
  threat_id: string;
  correlation_pipeline_id: string;
  monitored: boolean;
  changed: boolean;
}

export interface ActiveThreatBlockedResponse {
  threat_id: string;
  is_blocked: boolean;
  changed: boolean;
  pipelines_republished: number;
}
