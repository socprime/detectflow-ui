import { create } from 'zustand';
import { api, PaginationParams } from '../models/providers';
import type { Topic, TopicEvent, TopicsResponse } from '../models/providers/Types/Response';
import { createBaseActions, handleAsyncAction } from './middleware';

interface TopicsState {
  loading: boolean;
  error: string | null;
  topics: TopicsResponse | null;
  allTopics: Topic[];
  topicEvents: TopicEvent[];

  fetchTopics: (params?: PaginationParams) => Promise<TopicsResponse>;
  fetchAllTopics: () => Promise<Topic[]>;
  fetchTopicEvents: (topicIds: string[]) => Promise<TopicEvent[]>;
}

const initialState: Omit<TopicsState, 'fetchTopics' | 'fetchAllTopics' | 'fetchTopicEvents'> = {
  loading: false,
  error: null,
  allTopics: [],
  topicEvents: [],
  topics: {
    total: 0,
    limit: 0,
    offset: 0,
    sort: null,
    order: 'desc',
    data: [],
    page: 1,
    search: '',
  },
};

export const useTopicsStore = create<TopicsState>((set) => ({
  ...initialState,

  fetchTopics: (params) =>
    handleAsyncAction(
      async () => {
        const topics = await api.settings.topics.getList(params);
        set({ topics });
        return topics;
      },
      set,
      'Failed to fetch topics',
    ),

  fetchAllTopics: () =>
    handleAsyncAction(
      async () => {
        const topics = await api.settings.topics.getList({
          offset: 0,
          limit: 200,
        });
        set({ allTopics: topics.data });
        return topics.data;
      },
      set,
      'Failed to fetch all topics',
    ),

  fetchTopicEvents: (topicIds) =>
    handleAsyncAction(
      async () => {
        const topicEvents = await api.settings.topics.getEvents(topicIds);
        set({ topicEvents });
        return topicEvents;
      },
      set,
      'Failed to fetch topic events',
    ),
  ...createBaseActions(initialState, set),
}));
