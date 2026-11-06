export interface CorrelationJobGraphDataPoint {
  name: string;
  value: number;
}

export interface CorrelationJobGraphData {
  count_active: number | null;
  count_all: number;
  name: string;
  points: CorrelationJobGraphDataPoint[];
}

// Derived pipeline status — exactly six values, never stored on the backend.
// 'stopped' is rendered as "Disabled" in the UI (label, not a seventh state).
export type CorrelationPipelineStatus =
  'running' | 'starting' | 'stopping' | 'stopped' | 'partial' | 'failed';

// Individual job (deployment) status — 'missing' means the deployment does not exist.
export type CorrelationJobStatus = CorrelationPipelineStatus | 'missing';

export type CorrelationJobHealth = 'healthy' | 'unhealthy' | 'unknown';

export interface CorrelationJobInfo {
  deployment_name: string;
  status: CorrelationJobStatus;
  started_at: string | null;
  error: string | null;
  health: CorrelationJobHealth;
  last_issue: string | null;
  operation?: string;
}

export interface AttackChainsRuntimeStateResponse {
  overall: CorrelationPipelineStatus;
  correlation_job: CorrelationJobInfo;
  agent_job: CorrelationJobInfo;
  job_uptime: string | null;
}

export interface CorrelationDashboardSnapshotResponse {
  blocks: CorrelationJobGraphData[];
  runtime_state?: AttackChainsRuntimeStateResponse;
}
