import { SystemStatus } from '@/enums';

export interface HealthCheckCheck {
  status: SystemStatus;
  title: string;
  descriptions: string[];
  updated: string;
}

export interface HealthCheckPlatforms {
  name: string;
  checks: HealthCheckCheck[];
}

export interface HealthCheckVersionResponse {
  detectflow_backend_version: string;
  match_node: {
    [key: string]: string;
  };
}

export interface HealthCheckResponse {
  platforms: HealthCheckPlatforms[];
  versions: HealthCheckVersionResponse;
}

export interface VersionResponse {
  status: string;
  detectflow_backend_version: string;
  services: Record<string, boolean>;
  database_pool: {
    pool_size: number;
    max_overflow: number;
    checked_out: number;
    checked_in: number;
    total: number;
    overflow_current: number;
  };
}
