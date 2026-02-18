import { dashboardSSEConfig } from '@/config/sse';
import type { SSEDashboardData, SSEMessage, SSEMessageType } from '@/config/types';
import { api } from '@/models/providers';
import { create } from 'zustand';

export type MetricMode = 'events' | 'tagged';

export interface SourceTopicMetric {
  id: string;
  name: string;
  eps: number;
}

export interface RepositoryMetric {
  id: string;
  name: string;
  rulesCount: number;
}

export interface DestinationTopicMetric {
  id: string;
  name: string;
  taggedEps: number;
  untaggedEps: number;
}

export interface DashboardStructure {
  sourceTopics: SourceTopicMetric[];
  repositories: RepositoryMetric[];
  destinationTopics: DestinationTopicMetric[];
}

export interface MetricValue {
  events: number;
  tagged: number;
  untagged: number;
}

export interface DashboardValues {
  sourceTopicsTotal: MetricValue;
  repositoriesTotal: number;
  destinationTopicsTotal: MetricValue;
  pipelines: number;
}

export type NodeSelectionType =
  | 'source'
  | 'destination'
  | 'sourceMore'
  | 'destMore'
  | 'repository'
  | 'repoMore';

export interface NodeSelection {
  id: string;
  type: NodeSelectionType;
}

interface DashboardState {
  loading: boolean;
  error: string | null;
  dashboardStructure: DashboardStructure | null;
  dashboardValues: DashboardValues | null;
  dashboardData: SSEDashboardData | null;
  sseConnected: boolean;
  sseEnabled: boolean;
  metricMode: MetricMode;
  tablePiplinesOpen: boolean;
  lastUpdate: Date | null;
  consumerHealthy: boolean;

  selectedNode: NodeSelection | null;
  selectedSources: string[];
  selectedDestinations: string[];
  selectedRepos: string[];

  fetchSnapshot: () => Promise<void>;
  updateFromSSE: (data: SSEDashboardData) => void;
  setSSEConnected: (connected: boolean) => void;
  setSSEEnabled: (enabled: boolean) => void;
  setMetricMode: (mode: MetricMode) => void;
  setTablePiplinesOpen: (open: boolean) => void;
  clearError: () => void;
  reset: () => void;

  setNodeSelection: (
    node: NodeSelection | null,
    sources: string[],
    destinations: string[],
    repos: string[],
  ) => void;
  clearNodeSelection: () => void;

  initializeSSE: () => void;
  disconnectSSE: () => void;
}

const initialState: Pick<
  DashboardState,
  | 'loading'
  | 'error'
  | 'dashboardStructure'
  | 'dashboardValues'
  | 'dashboardData'
  | 'sseConnected'
  | 'sseEnabled'
  | 'metricMode'
  | 'tablePiplinesOpen'
  | 'lastUpdate'
  | 'consumerHealthy'
  | 'selectedNode'
  | 'selectedSources'
  | 'selectedDestinations'
  | 'selectedRepos'
> = {
  loading: false,
  error: null,
  dashboardStructure: null,
  dashboardValues: null,
  dashboardData: null,
  sseConnected: false,
  sseEnabled: true,
  metricMode: 'events',
  tablePiplinesOpen: false,
  lastUpdate: null,
  consumerHealthy: true,
  selectedNode: null,
  selectedSources: [],
  selectedDestinations: [],
  selectedRepos: [],
};

const transformSSEData = (
  data: SSEDashboardData,
): { structure: DashboardStructure; values: DashboardValues } => {
  const structure: DashboardStructure = {
    sourceTopics: data.graph.source_topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      eps: topic.eps,
    })),
    repositories: data.graph.repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      rulesCount: repo.rules_count,
    })),
    destinationTopics: data.graph.destination_topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      taggedEps: topic.tagged_eps,
      untaggedEps: topic.untagged_eps,
    })),
  };

  const totalSourceEvents = data.graph.source_topics.reduce((sum, t) => sum + t.eps, 0);
  const totalDestTagged = data.graph.destination_topics.reduce((sum, t) => sum + t.tagged_eps, 0);
  const totalDestUntagged = data.graph.destination_topics.reduce(
    (sum, t) => sum + t.untagged_eps,
    0,
  );
  const totalDestEvents = totalDestTagged + totalDestUntagged;

  const values: DashboardValues = {
    sourceTopicsTotal: {
      events: Math.round(totalSourceEvents * 100) / 100,
      tagged: Math.round(data.graph.total_events_eps * 100) / 100,
      untagged: 0,
    },
    repositoriesTotal: data.graph.total_rules,
    destinationTopicsTotal: {
      events: Math.round(totalDestEvents * 100) / 100,
      tagged: Math.round(totalDestTagged * 100) / 100,
      untagged: Math.round(totalDestUntagged * 100) / 100,
    },
    pipelines: data.graph.pipelines_count,
  };

  return { structure, values };
};

class DashboardSSEManager {
  private eventSource: EventSource | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private config: typeof dashboardSSEConfig;
  private callbacks: {
    onDataUpdate: (data: SSEDashboardData) => void;
    onConnected: (connected: boolean) => void;
    onError: (error: string) => void;
  };
  private isDisconnecting = false;

  constructor(
    config: typeof dashboardSSEConfig,
    callbacks: {
      onDataUpdate: (data: SSEDashboardData) => void;
      onConnected: (connected: boolean) => void;
      onError: (error: string) => void;
    },
  ) {
    this.config = config;
    this.callbacks = callbacks;
  }

  connect() {
    if (this.eventSource?.readyState === EventSource.OPEN) return;
    if (this.isDisconnecting) return;

    try {
      this.eventSource = new EventSource(this.config.streamUrl, {
        withCredentials: true,
      });

      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0;
        this.callbacks.onConnected(true);
      };

      this.eventSource.onmessage = (event) => {
        try {
          const message: SSEMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (err) {
          console.error('[SSE] Parse error:', err);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('[SSE] Error:', error);
        this.callbacks.onConnected(false);

        this.eventSource = null;

        if (!this.isDisconnecting) {
          this.attemptReconnect();
        }
      };
    } catch (err) {
      console.error('[SSE] Connection failed:', err);
      this.callbacks.onError('SSE connection failed');
    }
  }

  private handleMessage(message: SSEMessage) {
    switch (message.type) {
      case 'dashboard_update' as SSEMessageType:
        if ('data' in message && message.data) {
          this.callbacks.onDataUpdate(message.data);
        }
        break;
      case 'error' as SSEMessageType:
        if ('error' in message) {
          this.callbacks.onError(message.error);
        }
        break;
      default:
        console.warn('[SSE] Unknown message type:', message.type);
    }
  }

  private attemptReconnect() {
    if (!this.config.reconnect) return;
    if (this.reconnectAttempts >= (this.config.reconnectAttempts || 10)) {
      console.error('[SSE] Max reconnect attempts reached');
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      console.log('[SSE] Attempting reconnect...');
      this.reconnectAttempts++;
      this.connect();
    }, this.config.reconnectInterval || 3000);
  }

  disconnect() {
    this.isDisconnecting = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.isDisconnecting = false;
  }
}

let sseManagerInstance: DashboardSSEManager | null = null;

export const useDashboardStore = create<DashboardState>((set, get) => ({
  ...initialState,

  initializeSSE: () => {
    if (sseManagerInstance) return;

    const state = get();
    if (!state.sseEnabled || !dashboardSSEConfig.enabled) return;

    const callbacks = {
      onDataUpdate: (data: SSEDashboardData) => {
        get().updateFromSSE(data);
      },
      onConnected: (connected: boolean) => {
        get().setSSEConnected(connected);
      },
      onError: (error: string) => {
        console.error('[SSE]', error);
        set({ error });
      },
    };

    sseManagerInstance = new DashboardSSEManager(dashboardSSEConfig, callbacks);
    sseManagerInstance.connect();
  },

  disconnectSSE: () => {
    if (sseManagerInstance) {
      sseManagerInstance.disconnect();
      sseManagerInstance = null;
    }
    get().setSSEConnected(false);
  },

  fetchSnapshot: async () => {
    set({ loading: true, error: null });

    try {
      const data = await api.dashboard.getSnapshot();
      const { structure, values } = transformSSEData(data);

      set({
        dashboardData: data,
        dashboardStructure: structure,
        dashboardValues: values,
        lastUpdate: new Date(data.last_kafka_update),
        consumerHealthy: data.consumer_healthy,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch snapshot';
      set({ error: errorMessage, loading: false });
      console.error('[Dashboard] Snapshot fetch error:', error);
    }
  },

  updateFromSSE: (data: SSEDashboardData) => {
    const { structure, values } = transformSSEData(data);

    set({
      dashboardData: data,
      dashboardStructure: structure,
      dashboardValues: values,
      lastUpdate: new Date(),
      error: null,
    });
  },

  setSSEConnected: (connected: boolean) => {
    set({ sseConnected: connected });
  },

  setSSEEnabled: (enabled: boolean) => {
    const state = get();
    set({ sseEnabled: enabled });

    if (enabled && !sseManagerInstance) {
      state.initializeSSE();
    } else if (!enabled && sseManagerInstance) {
      state.disconnectSSE();
    }
  },

  setMetricMode: (mode: MetricMode) => {
    set({ metricMode: mode });
  },

  setTablePiplinesOpen: (open: boolean) => {
    set({ tablePiplinesOpen: open });
  },

  setNodeSelection: (node, sources, destinations, repos) => {
    set({
      selectedNode: node,
      selectedSources: sources,
      selectedDestinations: destinations,
      selectedRepos: repos,
    });
  },

  clearNodeSelection: () => {
    set({
      selectedNode: null,
      selectedSources: [],
      selectedDestinations: [],
      selectedRepos: [],
    });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    if (sseManagerInstance) {
      sseManagerInstance.disconnect();
      sseManagerInstance = null;
    }
    set(initialState);
  },
}));
