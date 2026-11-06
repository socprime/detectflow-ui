import type { KeyValuePair, PaginatedResponse } from './common';
import type { TRepositoryIds } from './repositories';

export interface LogSource {
  id: string;
  name: string;
  parsing_script: string;
  parsing_config: KeyValuePair;
  mapping: string;
  test_topics: string[];
  test_repository_ids: TRepositoryIds[];
  created: string;
  updated: string;
}

export interface LogSourceResponse extends LogSource {}

export interface RunTransformTestResult {
  source_data: string;
  parsed_data: any;
  success?: boolean;
  source_topic: string;
  error_message: string;
}

export interface RunTransformTestResponse {
  result: RunTransformTestResult[];
}

export interface RunPreviewParseTestResponse {
  result: RunTransformTestResult[];
}

export interface LogSourcesResponse extends PaginatedResponse<LogSource> {}

export interface RunParserResponse {
  result: any[];
}
