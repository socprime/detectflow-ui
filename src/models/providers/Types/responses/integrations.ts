import type { PaginatedResponse, StatusResponse } from './common';

export interface IntegrationTypeCatalogItem {
  integration_type: string;
  display_name: string;
  category: string;
  description: string;
  icon: string;
  capabilities: string[];
  connected_count: number;
}

export interface IntegrationTypesResponse {
  data: IntegrationTypeCatalogItem[];
}

export interface ConfigSchemaProperty {
  title: string;
  description: string;
  type: 'string' | 'select' | 'boolean' | string;
  placeholder?: string;
  sensitive?: boolean;
  default?: string | string[];
  enum?: string[];
  section?: string;
  ui_order: number;
  immutable_after_create?: boolean;
}

export interface ConfigSchema {
  title: string;
  description: string;
  type: string;
  properties: Record<string, ConfigSchemaProperty>;
  required?: string[];
}

export interface IntegrationTypeDetailResponse extends IntegrationTypeCatalogItem {
  config_schema: ConfigSchema;
  sensitive_fields: string[];
}

export interface CreateIntegrationResponse extends StatusResponse {}

export interface IntegrationConnectionCheckResponse {
  success: boolean;
  message: string;
  details: Record<string, unknown>;
}

export interface ConnectedIntegrationProfile {
  id: string;
  name: string;
  integration_type: string;
  integration_type_display: string;
  category: string;
  icon: string;
  status: string;
  status_message: string;
  created: string;
  updated: string;
}

export interface IntegrationDetailResponse {
  id: string;
  name: string;
  integration_type: string;
  integration_type_display: string;
  category: string;
  icon: string;
  status: string;
  status_message: string;
  config: Record<string, unknown>;
  capabilities: string[];
  last_checked_at: string;
  created: string;
  updated: string;
}

export interface UpdateIntegrationResponse extends StatusResponse {}

export interface DeleteIntegrationResponse extends StatusResponse {}

export interface ConnectedIntegrationsResponse extends PaginatedResponse<ConnectedIntegrationProfile> {}

export interface IntegrationViewInSiemResponse {
  status: boolean;
  message: string;
  url: string;
  query?: string;
}
