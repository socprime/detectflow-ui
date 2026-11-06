import type { PaginatedResponse } from './common';

export interface TopicPipeline {
  id: string;
  name: string;
  type: 'unused' | 'source' | 'destination';
}

export interface Topic {
  name: string;
  pipelines: TopicPipeline[];
}

export interface TopicsResponse extends PaginatedResponse<Topic> {}

export interface TopicEvent {
  topic: string;
  event: string;
}

export interface TopicEventsResponse {
  events: TopicEvent[];
}
