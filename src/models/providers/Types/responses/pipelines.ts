import type { TLevel } from '@/utils';
import type { ActionLog, KeyValuePair, PaginatedResponse } from './common';
import type { TRepositoryIds } from './repositories';

export interface IPipelineRuntimeResponse {
  parallelism: number;
  taskmanager_memory_mb: number;
  taskmanager_cpu: number;
  window_size_sec: number;
  checkpoint_interval_sec: number;
}

export interface PipelineStatusDetails {
  level: ActionLog;
  job_manager_status: string | null;
  lifecycle_state: string | null;
  warnings: string[];
  error: string | null;
  source: string;
}

export type PipelineOutputMode = 'all_events' | 'matched_only' | 'unmatched_only';

export interface PipelineDestination {
  topic: string;
  output_mode: PipelineOutputMode;
  apply_parser_to_output_events: boolean;
  severities?: TLevel[];
}

export interface CorrelationPipelineItem {
  id: string;
  name: string;
}

export interface Pipelines {
  id: string;
  correlation_pipelines: CorrelationPipelineItem[];
  enabled: boolean;
  name: string;
  source_topics: string[];
  destinations: PipelineDestination[];
  destination_topic: string;
  repositories: KeyValuePair[];
  log_source: KeyValuePair[];
  filters: number;
  rules: number;
  supported_rules: number;
  events_tagged: number;
  events_untagged: number;
  status: string;
  status_details: PipelineStatusDetails;
  needs_restart: boolean;
  detectflow_matchnode_version: string;
  created: string;
  updated: string;
}

export interface Pipeline extends IPipelineRuntimeResponse {
  id: string;
  name: string;
  source_topics: string[];
  destinations: PipelineDestination[];
  destination_topic: string;
  save_untagged: boolean;
  apply_parser_to_output_events: boolean;
  filters: string[];
  log_source_id: string;
  log_source_name: string;
  enabled: boolean;
  repository_ids: TRepositoryIds[];
  custom_fields: string;
  events_tagged: number;
  events_untagged: number;
  rules_topic: string;
  metrics_topic: string;
  status: string;
  status_details: PipelineStatusDetails;
  deployment_name: string;
  namespace: string;
  last_sync_at: string;
  active_rules: number;
  matched_rules: number;
  supported_rules_count: number;
  total_rules_count: number;
  warnings: string[];
  needs_restart: boolean;
  autoscaler_enabled: boolean;
  autoscaler_min_parallelism: number;
  autoscaler_max_parallelism: number;
  detectflow_matchnode_version: string;
}

export interface PipelineInfo {
  id: string;
  name: string;
  enabled: boolean;
}

export interface PipelinesResponse extends PaginatedResponse<Pipelines> {}
export interface PipelineResponse extends Pipeline {}

export interface PipelineRule {
  id: string;
  name: string;
  repository: string;
  repository_id: string;
  created: string;
  updated: string;
  enabled: boolean;
  tagged_events: number;
  sigma_uuid: string | null;
  is_supported?: boolean;
  unsupported_reason?: string;
  level: TLevel;
}

export interface PipelineRulesResponse extends PaginatedResponse<PipelineRule> {}

export interface FlinkDefaultsParameters {
  name: string;
  type: string;
  default: number;
  min: number;
  max: number;
  unit: string;
  title: string;
  description: string;
  impact: string;
  category: string;
  requires: string;
  tips: string[];
}

export interface FlinkDefaultsCategories {
  [key: string]: {
    title: string;
    description: string;
    order: number;
  };
}

export interface FlinkDefaultsImpactDescriptions {
  [key: string]: string;
}

export interface PipelineRuntimeSchemaResponse {
  parameters: FlinkDefaultsParameters[];
  categories: FlinkDefaultsCategories;
  impact_descriptions: FlinkDefaultsImpactDescriptions;
}
