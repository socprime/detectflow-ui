import type { TLevel } from '@/utils';
import type { PaginatedResponse } from './common';

export interface HighOrderSigmaListItem {
  id: string;
  tdm_id: string;
  name: string;
  created: string;
  updated: string;
  is_user_edited: boolean;
  level: TLevel;
}

export interface HighOrderSigmasResponse extends PaginatedResponse<HighOrderSigmaListItem> {}

export interface HighOrderSigma {
  id: string;
  tdm_id: string;
  name: string;
  body: string;
  tdm_created: string;
  tdm_updated: string;
  created: string;
  updated: string;
  is_user_edited: boolean;
  level: TLevel;
}
