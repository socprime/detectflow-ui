import type { PaginatedResponse } from './common';

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
