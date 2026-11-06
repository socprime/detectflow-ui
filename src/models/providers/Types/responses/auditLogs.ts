import type { ActionLog, PaginatedResponse } from './common';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  user_id: string;
  user_email: string;
  details: string;
  source: string;
  severity: ActionLog;
}

export interface AuditLogsResponse extends PaginatedResponse<AuditLog> {}

export interface AuditLogsFiltersResponse {
  actions: string[];
  entity_types: string[];
}

export type AuditLogsExportResponse = string;
