import type {
  ActiveThreatHighOrderSigma,
  ActiveThreatPipelineMonitoring,
  ActiveThreatRule,
} from './activeThreats';
import type { PaginatedResponse } from './common';

import { EChainStatus } from '@/enums';
import type { TLevel, TSeverity } from '@/utils';
import { HighOrderSigma } from './highOrderSigma';

export interface AttackChainListItem {
  id: string;
  name: string;
  chain_type: string;
  hostname: string;
  username: string;
  status: EChainStatus;
  severity: TSeverity;
  first_seen: string;
  last_seen: string;
  event_count: number;
  rule_count: number;
  match: number;
  correlation_pipeline_id: string | null;
  correlation_pipeline_name: string | null;
  correlation_pipelines: RuleCheckResultsPipeline[];
  created_at: string;
  updated_at: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface AttackChainsFiltersSection {
  group: FilterOption[];
  severity: string[];
  status: string[];
}

export interface MonitoredThreatsFiltersSection {
  severity: string[];
  industry: string[];
  threatType: string[];
  region: string[];
}

export interface AttackChainsPageFiltersResponse {
  attack_chains: AttackChainsFiltersSection;
  monitored_threats: MonitoredThreatsFiltersSection;
}

export interface AttackChainsResponse extends PaginatedResponse<AttackChainListItem> {
  group_by: string;
  groups: Record<string, AttackChainListItem[]>;
  filtered_out_count: number;
}

export interface AttackChainActiveThreat {
  tdm_id: string;
  name: string;
  summary: string;
  investigation: string;
  response: string;
  mitigation: string;
  attack_flow: string;
  tdm_created: string;
  tdm_updated: string;
  created: string;
  updated: string;
  rules: ActiveThreatRule[];
  is_blocked: boolean;
  severity: TSeverity;
  industries: string[];
  geographies: string[];
  threat_types: string[];
  source: string;
  threat_actors: string[];
  is_hidden: boolean;
  rule_check_results: RuleCheckResults;
  high_order_sigmas: ActiveThreatHighOrderSigma[];
  pipelines: ActiveThreatPipelineMonitoring[];
}

export interface AttackChainAssignee {
  id: string;
  full_name: string;
  email: string;
}

export interface AttackChainGraph {
  name: string;
  description: string;
  hit: boolean;
  code: string;
}

export type ChainGraphBranch = {
  from_code: string;
  to_code: string;
  node: AttackChainGraph;
};

export interface TechniqueRule {
  first_seen: string;
  last_seen: string;
  tagged_events: number;
  rule_name: string;
  sigma_rule_id: string;
  rule_id: string;
  repository_id: string;
  level: TLevel;
}

export interface AttackChainAlternative {
  from_code: string;
  to_code: string;
  node: AttackChainGraph;
}

export interface Technique {
  name: string;
  description: string;
  code: string;
  first_seen: string;
  last_seen: string;
  rules: TechniqueRule[];
}

export interface AttackChainThreatActors {
  id: string;
  name: string;
}

export interface AttackChainDetailResponse {
  id: string;
  name: string;
  chain_type: string;
  hostname: string;
  username: string;
  status: string;
  severity: TSeverity;
  first_seen: string;
  last_seen: string;
  event_count: number;
  rule_count: number;
  match: number;
  correlation_pipeline_id: string | null;
  correlation_pipeline_name: string | null;
  correlation_pipelines: RuleCheckResultsPipeline[];
  ai_summary: string | null;
  llm_verdict: string | null;
  llm_confidence: number | null;
  llm_review: string | null;
  analysed_at: string | null;
  created_at: string;
  updated_at: string;
  hos_rule: HighOrderSigma;
  active_threat: AttackChainActiveThreat;
  threat_actors: AttackChainThreatActors[];
  techniques: Technique[];
  chain_graph: AttackChainGraph[];
  chain_alternatives?: ChainGraphBranch[];
}

export type RuleCheckResultsItem = {
  rule_id: string;
  rule_name: string;
  description?: string;
};

export interface RuleCheckResultsPipeline {
  id: string;
  name: string;
}

export interface RuleCheckResultsDisabled extends RuleCheckResultsItem {
  pipelines: RuleCheckResultsPipeline[];
}

export type RuleCheckResults = {
  unsupported_rules: RuleCheckResultsItem[];
  not_connected_rules: RuleCheckResultsItem[];
  disabled_rules: RuleCheckResultsDisabled[];
};
