import type { TLevel } from '@/utils';
import type { PaginatedResponse } from './common';
import type { RepositoryType } from './repositories';

export interface Rule {
  id: string;
  name: string;
  version: number;
  repository_id: string;
  repository_type: RepositoryType;
  repository_name: string;
  created: string;
  updated: string;
  product: string | null;
  service: string | null;
  category: string | null;
  folder_path: string;
  sigma_uuid: string | null;
  external_id: string | null;
  is_supported: boolean;
  unsupported_reason: string | null;
  level: TLevel;
}

export interface RulesResponse extends PaginatedResponse<Rule> {}

export interface BulkCreatedRule {
  id: string;
  name: string;
  is_supported: boolean;
}

export interface BulkCreateRulesResponse {
  total: number;
  supported: number;
  data: BulkCreatedRule[];
}

export interface RuleVersion {
  version: number;
  content_hash: string;
  changed_at: string;
  change_source: string;
  changed_by: string;
}

export interface RuleDetailsResponse extends Rule {
  is_user_edited_system_rule: boolean;
  body: string;
  content_hash: string;
  versions: RuleVersion[];
}
