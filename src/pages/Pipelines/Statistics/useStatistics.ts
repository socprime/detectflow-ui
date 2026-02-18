import { usePipelinesStore } from '@/store/pipelines';

export const useStatistics = () => {
  const { loading, error, pipelineStatistics } = usePipelinesStore();

  const stats = pipelineStatistics || {
    topics: { source: 0, destination: 0 },
    networks: { nodes: 0, clusters: 0 },
    rules: { active: 0, matched: 0 },
    events: { tagged: 0, untagged: 0 },
  };

  return {
    loading,
    error,
    stats,
  };
};
