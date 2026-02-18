import { PipelineStatusDetails } from '@/models/providers';

export enum SSEMessageType {
  DASHBOARD_UPDATE = 'dashboard_update',
  ERROR = 'error',
}

export interface SSESourceTopic {
  id: string;
  name: string;
  eps: number;
}

export interface SSERepository {
  id: string;
  name: string;
  rules_count: number;
}

export interface SSEDestinationTopic {
  id: string;
  name: string;
  tagged_eps: number;
  untagged_eps: number;
}

export interface SSEGraphData {
  source_topics: SSESourceTopic[];
  repositories: SSERepository[];
  destination_topics: SSEDestinationTopic[];
  pipelines_count: number;
  total_events_eps: number;
  total_tagged_eps: number;
  total_rules: number;
}

export interface SSEPipelineStat {
  id: string;
  name: string;
  source_topics: string[];
  destination_topic: string;
  repository_ids?: string[];
  input_eps: number;
  output_eps: number;
  topic_lag: number;
  status: string;
  status_details: PipelineStatusDetails;
}

export interface SSERecentEvent {
  id: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface SSEDashboardData {
  graph: SSEGraphData;
  pipelines_stats: SSEPipelineStat[];
  recent_activity: SSERecentEvent[];
}

export interface SSEDashboardUpdateMessage {
  type: SSEMessageType.DASHBOARD_UPDATE;
  data: SSEDashboardData;
  timestamp: string;
}

export interface SSEErrorMessage {
  type: SSEMessageType.ERROR;
  error: string;
  timestamp?: string;
}

export type SSEMessage = SSEDashboardUpdateMessage | SSEErrorMessage;

export interface DashboardSnapshotResponse extends SSEDashboardData {
  last_kafka_update: string;
  consumer_healthy: boolean;
}

export interface DashboardSSEConfig {
  enabled: boolean;
  streamUrl: string;
  snapshotUrl: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export interface DashboardSSEState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  lastUpdate: Date | null;
  reconnectCount: number;
}
