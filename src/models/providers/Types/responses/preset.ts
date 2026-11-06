import { PaginatedResponse } from './common';

export interface Preset {
  id: string;
  name: string;
  siem_type: string;
  siem_name: string;
  user_id: string;
  rule_filter_ids: string[];
  body: {
    [key: string]: any;
  };
  created: string;
  updated: string;
}

export interface PresetsResponse extends PaginatedResponse<Preset> {}
export interface PresetResponse extends Preset {}
