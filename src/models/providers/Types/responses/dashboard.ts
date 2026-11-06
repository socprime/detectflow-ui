export type { DashboardSnapshotResponse } from '@/config/types';

export interface DashboardTopics {
  id: string;
  name: string;
  unit: string;
  value: number;
}

export interface TopicTotal {
  unit: string;
  value: number;
}

export interface SourceTopics {
  topics: DashboardTopics[];
  total: TopicTotal;
}

export interface Repository {
  id: string;
  name: string;
  value: number;
}

export interface Repositories {
  repositories: Repository[];
  total: {
    value: number;
  };
}

export interface DestinationTopics {
  topics: DashboardTopics[];
  total: TopicTotal;
}

export interface DashboardGraphResponse {
  source_topics: SourceTopics;
  repositories: Repositories;
  destination_topics: DestinationTopics;
  pipelines: number;
}

export interface RecentEvent {
  id: string;
  message: string;
  detail: any[];
  timestamp: string;
  type: string;
}

export interface RecentEventsResponse {
  Events: RecentEvent[];
}

export interface ActivePipeline {
  id: string;
  name: string;
  source_topics: string[];
  destination_topic: string;
  input: number;
  output: number;
  topic_lag: number;
}

export interface ActivePipelinesResponse {
  pipelines: ActivePipeline[];
}

export interface PipelineStatisticsResponse {
  topics: {
    source: number;
    destination: number;
  };
  networks: {
    nodes: number;
    clusters: number;
  };
  rules: {
    active: number;
    matched: number;
  };
  events: {
    tagged: number;
    untagged: number;
  };
}
