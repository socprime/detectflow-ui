export type MetricMode = 'events' | 'tagged';

export type NodeSelectionType =
  'source' | 'destination' | 'sourceMore' | 'destMore' | 'repository' | 'repoMore';

export interface SourceTopicMetric {
  id: string;
  name: string;
  eps: number;
}

export interface RepositoryMetric {
  id: string;
  name: string;
  rulesCount: number;
}

export interface DestinationTopicMetric {
  id: string;
  name: string;
  taggedEps: number;
  untaggedEps: number;
}

export interface DashboardStructure {
  sourceTopics: SourceTopicMetric[];
  repositories: RepositoryMetric[];
  destinationTopics: DestinationTopicMetric[];
}

export interface MetricValue {
  events: number;
  tagged: number;
  untagged: number;
}

export interface DashboardValues {
  sourceTopicsTotal: MetricValue;
  repositoriesTotal: number;
  destinationTopicsTotal: MetricValue;
  pipelines: number;
}

export interface NodeSelection {
  id: string;
  type: NodeSelectionType;
}
