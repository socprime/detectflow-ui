import type { PaginatedResponse } from './common';
import type {
  AttackChainsRuntimeStateResponse,
  CorrelationPipelineStatus,
} from './correlation';

export type CorrelationPipelineJobsStatus = 'running' | 'starting' | 'stopping' | 'stopped';

export type CorrelationJobKind = 'correlation' | 'agent';

export interface CorrelationPipelineMember {
  pipeline_id: string;
  name: string;
  destination_topic: string;
  tagged_events_topic: string;
  enabled: boolean;
}

export interface CorrelationPipelineResources {
  parallelism: number | null;
  taskmanager_memory_mb: number | null;
  taskmanager_cpu: number | null;
  jobmanager_memory_mb: number | null;
  jobmanager_cpu: number | null;
}

export interface CorrelationPipelineListItem {
  id: string;
  name: string;
  destination_topics: string[];
  jobs_status: CorrelationPipelineJobsStatus;
  runtime_state: AttackChainsRuntimeStateResponse | null;
  members: CorrelationPipelineMember[];
  attack_chains_count: number;
  created_at: string;
  updated_at: string;
}

export interface CorrelationPipelinesResponse extends PaginatedResponse<CorrelationPipelineListItem> {}

export interface CorrelationPipelineDetail extends CorrelationPipelineListItem {
  threshold_pct: number;
  correlation_window_seconds: number | null;
  auto_add_new_pipelines: boolean;
  auto_add_pipeline_name_pattern: string | null;
  correlation_resources: CorrelationPipelineResources;
  agent_resources: CorrelationPipelineResources;
  correlation_deployment_name: string;
  agent_deployment_name: string;
  updated_by: string;
  warnings: string[];
  restarted: CorrelationJobKind[];
}

export type CorrelationPipelineMutationResponse = CorrelationPipelineDetail;

export interface CorrelationPipelineRunStopResponse {
  status: CorrelationPipelineStatus;
  correlation_job: Record<string, unknown>;
  agent_job: Record<string, unknown>;
  warnings: string[];
  restarted: CorrelationJobKind[];
}
