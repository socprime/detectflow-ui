import type { DashboardStructure, DashboardValues, MetricMode, NodeSelection } from '@/types';
import { create } from 'zustand';

import { dashboardSSEConfig } from '@/config/sse';
import type { SSEDashboardData } from '@/config/types';
import { api } from '@/models/providers';
import { SSEManager } from '@/services/sse/SSEManager';

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
}

interface DashboardActions {
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

type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
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

const round = (num: number) => Math.round(num * 100) / 100;

const transformSSEData = (
  data: SSEDashboardData,
): { structure: DashboardStructure; values: DashboardValues } => {
  const {
    source_topics,
    repositories,
    destination_topics,
    total_events_eps,
    total_tagged_eps,
    total_untagged_eps,
    total_rules,
    pipelines_count,
  } = data.graph;

  const totalSourceEvents = source_topics.reduce((sum, t) => sum + t.eps, 0);
  const totalDestTagged =
    total_tagged_eps ?? destination_topics.reduce((sum, t) => sum + t.tagged_eps, 0);
  const totalDestUntagged =
    total_untagged_eps ?? destination_topics.reduce((sum, t) => sum + t.untagged_eps, 0);
  const totalDestEvents = totalDestTagged + totalDestUntagged;

  return {
    structure: {
      sourceTopics: source_topics.map((t) => ({ id: t.id, name: t.name, eps: t.eps })),
      repositories: repositories.map((r) => ({
        id: r.id,
        name: r.name,
        rulesCount: r.rules_count,
      })),
      destinationTopics: destination_topics.map((t) => ({
        id: t.id,
        name: t.name,
        taggedEps: t.tagged_eps,
        untaggedEps: t.untagged_eps,
      })),
    },
    values: {
      sourceTopicsTotal: {
        events: round(totalSourceEvents),
        tagged: round(total_events_eps),
        untagged: 0,
      },
      repositoriesTotal: total_rules,
      destinationTopicsTotal: {
        events: round(totalDestEvents),
        tagged: round(totalDestTagged),
        untagged: round(totalDestUntagged),
      },
      pipelines: pipelines_count,
    },
  };
};

let sseManagerInstance: SSEManager<SSEDashboardData> | null = null;

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  ...initialState,

  initializeSSE: () => {
    if (sseManagerInstance || !get().sseEnabled || !dashboardSSEConfig.enabled) return;

    sseManagerInstance = new SSEManager<SSEDashboardData>(dashboardSSEConfig, {
      onDataUpdate: (data) => get().updateFromSSE(data),
      onConnected: (connected) => get().setSSEConnected(connected),
      onError: (error) => {
        console.error('[Dashboard SSE]', error);
        set({ error });
      },
    });
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
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch snapshot',
        loading: false,
      });
    }
  },

  updateFromSSE: (data) => {
    const { structure, values } = transformSSEData(data);
    set({
      dashboardData: data,
      dashboardStructure: structure,
      dashboardValues: values,
      lastUpdate: new Date(),
      error: null,
    });
  },

  setSSEConnected: (connected) => set({ sseConnected: connected }),

  setSSEEnabled: (enabled) => {
    set({ sseEnabled: enabled });
    if (enabled && !sseManagerInstance) {
      get().initializeSSE();
    } else if (!enabled && sseManagerInstance) {
      get().disconnectSSE();
    }
  },

  setMetricMode: (mode) => set({ metricMode: mode }),
  setTablePiplinesOpen: (open) => set({ tablePiplinesOpen: open }),

  setNodeSelection: (node, sources, destinations, repos) =>
    set({
      selectedNode: node,
      selectedSources: sources,
      selectedDestinations: destinations,
      selectedRepos: repos,
    }),

  clearNodeSelection: () =>
    set({ selectedNode: null, selectedSources: [], selectedDestinations: [], selectedRepos: [] }),
  clearError: () => set({ error: null }),

  reset: () => {
    get().disconnectSSE();
    set(initialState);
  },
}));
