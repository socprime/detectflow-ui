export type { DashboardSnapshotResponse } from '@/config/types';

export interface RepoSyncStatus {
  status: 'idle' | 'running' | 'completed' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  error: string | null;
}

export interface SyncStatusResponse {
  api_repos?: RepoSyncStatus;
  git_hub_repos?: RepoSyncStatus;
}

export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  sort: string | null;
  order: string;
  page?: number;
  search?: string;
  data: T[];
}

export interface StatusResponse {
  id?: string;
  status?: boolean;
  message: string;
}

export type RepositoryType = 'api' | 'local' | 'external';
export type RepositoryTypeDisplay = 'API' | 'Local' | 'External' | 'SOC Prime';

export interface RepositoryDetailResponse {
  id: string;
  name: string;
  type: RepositoryType;
  type_display: RepositoryTypeDisplay;
  rules: number;
  created: string;
  updated: string;
  sync?: boolean;
  pipelines?: PipelineInfo[];
  source_link?: string;
}

export interface AvailableRepository {
  id: string;
  name: string;
  is_added: boolean;
  source_link: string;
}

export interface CombinedAvailableRepository extends AvailableRepository {
  type: RepositoryType;
}

export interface AvailableRepositoryResponse {
  data: AvailableRepository[];
}

export interface RepositorySettings {
  api_key_configured: boolean;
  api_key_mask: string;
}

export interface CreateRepositoryResponse extends RepositoryDetailResponse {}

export interface UpdateApiKeyResponse {
  message: string;
}

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

export interface KeyValuePair {
  [key: string]: string;
}

export interface PipelineStatusDetails {
  level: ActionLog;
  job_manager_status: string | null;
  lifecycle_state: string | null;
  warnings: string[];
  error: string | null;
  source: string;
}

export interface Pipelines {
  id: string;
  enabled: boolean;
  name: string;
  source_topics: string[];
  destination_topic: string;
  repositories: KeyValuePair[];
  log_source: KeyValuePair[];
  filters: number;
  rules: number;
  events_tagged: number;
  events_untagged: number;
  status: string;
  status_details: PipelineStatusDetails;
  created: string;
  updated: string;
}

export interface Pipeline extends IPipelineRuntimeResponse {
  id: string;
  name: string;
  source_topics: string[];
  destination_topic: string;
  save_untagged: boolean;
  filters: string[];
  log_source_id: string;
  log_source_name: string;
  enabled: boolean;
  repository_ids: string[];
  custom_fields: string;
  events_tagged: number;
  events_untagged: number;
  rules_topic: string;
  metrics_topic: string;
  status: string;
  deployment_name: string;
  namespace: string;
  last_sync_at: string;
  active_rules: number;
  matched_rules: number;
  apply_parser_to_output_events: boolean;
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
  is_supported?: boolean;
  unsupported_reason?: string;
}

export interface PipelineRulesResponse extends PaginatedResponse<PipelineRule> {}

export interface TopicPipeline {
  id: string;
  name: string;
  type: 'unused' | 'source' | 'destination';
}

export interface Topic {
  name: string;
  pipelines: TopicPipeline[];
}

export interface TopicsResponse extends PaginatedResponse<Topic> {}

export interface TopicEvent {
  topic: string;
  event: string;
}

export interface TopicEventsResponse {
  events: TopicEvent[];
}

export interface ActiveFilterResponse {
  id: string;
  name: string;
}

export interface Filter {
  id: string;
  name: string;
  created: string;
  updated: string;
}

export interface FiltersResponse extends PaginatedResponse<Filter> {}

export interface FilterResponse extends Filter {
  body: string;
}

export interface LogSource {
  id: string;
  name: string;
  parsing_script: string;
  parsing_config: KeyValuePair;
  mapping: string;
  test_topics: string[];
  test_repository_ids: string[];
  created: string;
  updated: string;
}

export interface LogSourceResponse extends LogSource {}

export interface RunTransformTestResult {
  source_data: string;
  parsed_data: any;
  success?: boolean;
  source_topic: string;
  error_message: string;
}

export interface RunTransformTestResponse {
  result: RunTransformTestResult[];
}

export interface RunPreviewParseTestResponse {
  result: RunTransformTestResult[];
}

export interface LogSourcesResponse extends PaginatedResponse<LogSource> {}

export interface RepositoriesData {
  id: string;
  name: string;
  type: RepositoryType;
  type_display: RepositoryTypeDisplay;
  rules: number;
  sync_enabled?: boolean;
  pipelines?: PipelineInfo[];
  source_link?: string;
  created: string;
  updated: string;
}

export interface RepositoriesResponse extends PaginatedResponse<RepositoriesData> {}

export interface Rule {
  id: string;
  name: string;
  repository_id: string;
  repository_type: RepositoryType;
  repository_name: string;
  product: string | null;
  service: string | null;
  category: string | null;
  created: string;
  updated: string;
}

export interface RulesResponse extends PaginatedResponse<Rule> {}

export interface BulkCreateRuleFailure {
  name: string;
  error: string;
}

export interface BulkCreateRulesResponse {
  created: number;
  failed: BulkCreateRuleFailure[];
}

export interface RuleDetailsResponse {
  id: string;
  name: string;
  repository_id: string;
  repository_type: RepositoryType;
  repository_name: string;
  product: string | null;
  service: string | null;
  category: string | null;
  body: string;
  created: string;
  updated: string;
}

export type ActionLog = 'info' | 'warning' | 'error';

export interface RunParserResponse {
  result: any[];
}

export type UserRole = 'admin' | 'user';

export interface UserInfo {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  role: UserRole;
  must_change_password: boolean;
  created: string;
  updated: string;
}

export interface UserResponse extends UserInfo {}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  temporary_password: string;
  message: string;
}

export interface GenerateMappingResponse {
  job_id: string;
}

export interface MappingStatusResponse {
  status: 'queued' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at: string;
  error: string;
  mapping: string;
}

export interface GenerateMappingPromptResponse {
  prompt: string;
}

export interface SigmaFieldsResponse {
  sigma_fields: string[];
}

export interface IPipelineRuntimeResponse {
  parallelism: number;
  taskmanager_memory_mb: number;
  taskmanager_cpu: number;
  window_size_sec: number;
  checkpoint_interval_sec: number;
}

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
