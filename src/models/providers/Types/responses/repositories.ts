import type { PaginatedResponse } from './common';
import type { PipelineInfo } from './pipelines';

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

export type RepositoryType = 'api' | 'local' | 'external' | 'hos' | 'gitlab';
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

export interface TRepositoryIds {
  id: string;
  folders: string[];
}

export interface RepositoryFolder {
  path: string;
  rules_count: number;
  children: RepositoryFolder[];
}

export interface RepositoriesData {
  id: string;
  name: string;
  type: RepositoryType;
  type_display: RepositoryTypeDisplay;
  rules: number;
  sync_enabled?: boolean;
  source_link?: string;
  is_system?: boolean;
  system_key?: string | null;
  pipelines?: PipelineInfo[];
  folders?: RepositoryFolder[];
  created: string;
  updated: string;
}

export interface RepositoriesResponse extends PaginatedResponse<RepositoriesData> {}
