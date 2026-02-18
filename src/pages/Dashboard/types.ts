import { ActionLog } from '@/models/providers/Types/Response';
import type { Edge, Node } from '@xyflow/react';

export interface Event {
  id: string;
  severity: ActionLog;
  message: string;
  timestamp: string;
}

export type MetricMode = 'events' | 'bandwidth';

export interface NodeSelection {
  id: string;
  type: 'source' | 'destination' | 'sourceMore' | 'destMore' | 'repository' | 'repoMore';
}

export interface BaseNodeData {
  label?: string;
  index?: number;
  isSelected?: boolean;
  isDimmed?: boolean;
}

export interface TopicNodeData extends BaseNodeData {
  label: string;
}

export interface MoreNodeData extends BaseNodeData {
  count: number;
  type: 'source' | 'destination';
}

export interface RepositoryNodeData extends BaseNodeData {
  label: string;
}

export interface PipelinesNodeData {
  count?: number;
  filteredCount?: number;
}

export interface SourceAggregationNodeData {
  topicsCount: number;
  totalSpeed: number;
  metricMode: MetricMode;
  filteredValue?: number;
}

export interface RepositoryAggregationNodeData {
  reposCount: number;
  totalRules: number;
}

export interface DestinationAggregationNodeData {
  topicsCount: number;
  totalSpeed: number;
  metricMode: MetricMode;
  filteredValue?: number;
}

export interface AnimatedEdgeData {
  color: string;
  particleCount: number;
  shape: 'circle' | 'square' | 'triangle';
  animationDelay: number;
  isActive: boolean;
}

export interface DashboardStructure {
  sourceTopics: Array<{ id: string; name: string }>;
  repositories: Array<{ id: string; name: string }>;
  destinationTopics: Array<{ id: string; name: string }>;
}

export interface DashboardValues {
  sourceTopicsTotal: { unit: string; value: number };
  repositoriesTotal: { value: number };
  destinationTopicsTotal: { unit: string; value: number };
  pipelines: number;
}

export interface DashboardData {
  sourceTopics: Array<{ id: string; name: string; value: number; unit: string }>;
  repositories: Array<{ id: string; name: string; value: number }>;
  destinationTopics: Array<{ id: string; name: string; value: number; unit: string }>;
  pipelines: number;
  totalRules: number;
}

export type DashboardNode = Node<
  | (TopicNodeData & Record<string, unknown>)
  | (MoreNodeData & Record<string, unknown>)
  | (RepositoryNodeData & Record<string, unknown>)
  | (PipelinesNodeData & Record<string, unknown>)
  | (SourceAggregationNodeData & Record<string, unknown>)
  | (RepositoryAggregationNodeData & Record<string, unknown>)
  | (DestinationAggregationNodeData & Record<string, unknown>)
  | Record<string, never>
>;

export type DashboardEdge = Edge<AnimatedEdgeData & Record<string, unknown>>;
