import { create } from 'zustand';
import { mergeGraphData, parseGraphBlocks } from './utils';

import { correlationDashboardSSEConfig } from '@/config/sse';
import { api } from '@/models/providers';
import type { CorrelationJobGraphData } from '@/models/providers/Types/responses/correlation';
import { SSEManager } from '@/services/sse/SSEManager';

let correlationSseManager: SSEManager<{ blocks: CorrelationJobGraphData[] }> | null = null;

interface CorrelationDashboardState {
  loading: boolean;
  error: string | null;
  graphData: CorrelationJobGraphData[] | null;

  fetchSnapshot: () => Promise<void>;
  connectSSE: () => void;
  disconnectSSE: () => void;
  clearError: () => void;
}

const initialState = {
  loading: true,
  error: null,
  graphData: null,
};

const applyGraphBlocks = (
  data: unknown,
  previousGraphData: CorrelationJobGraphData[] | null,
): { graphData: CorrelationJobGraphData[] } | null => {
  const blocks = parseGraphBlocks(data);
  if (!blocks) {
    return null;
  }

  return { graphData: mergeGraphData(blocks, previousGraphData) };
};

export const useCorrelationDashboardStore = create<CorrelationDashboardState>((set, get) => ({
  ...initialState,

  fetchSnapshot: async () => {
    set((state) => ({ loading: state.graphData == null, error: null }));

    try {
      const data = await api.correlationDashboard.getSnapshot();
      const update = applyGraphBlocks(data, get().graphData);
      set(update ? { ...update, loading: false } : { loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard snapshot',
        loading: false,
      });
    }
  },

  connectSSE: () => {
    if (correlationSseManager) {
      return;
    }

    correlationSseManager = new SSEManager(
      correlationDashboardSSEConfig,
      {
        onDataUpdate: (data) => {
          const update = applyGraphBlocks(data, get().graphData);
          if (update) {
            set(update);
          }
        },
        onError: (error) => {
          console.error('[Correlation SSE]', error);
          set({ error });
        },
      },
      'correlation_job_graph_update',
    );
    correlationSseManager.connect();
  },

  disconnectSSE: () => {
    if (correlationSseManager) {
      correlationSseManager.disconnect();
      correlationSseManager = null;
    }
  },

  clearError: () => set({ error: null }),
}));
