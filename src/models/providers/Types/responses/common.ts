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

export interface KeyValuePair {
  [key: string]: string;
}

export type ActionLog = 'info' | 'warning' | 'error';
