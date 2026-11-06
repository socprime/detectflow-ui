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
