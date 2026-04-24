import type { SSEPipelineStat } from '@/config/types';
import { useDashboardStore } from '@/store/dashboard';
import { useCallback, useMemo } from 'react';
import { LAYOUT } from '../utils/constants';

const EMPTY_PIPELINES: SSEPipelineStat[] = [];

const normalizeSourceId = (id: string) => id.replace(/^source-/, '');
const normalizeDestinationId = (id: string) => id.replace(/^dest-/, '');
const normalizeRepositoryId = (id: string) => id.replace(/^repo-/, '');

export const useNodeSelection = () => {
  const structure = useDashboardStore((state) => state.dashboardStructure);
  const dashboardData = useDashboardStore((state) => state.dashboardData);
  const selectedNode = useDashboardStore((state) => state.selectedNode);
  const selectedSources = useDashboardStore((state) => state.selectedSources);
  const selectedDestinations = useDashboardStore((state) => state.selectedDestinations);
  const selectedRepos = useDashboardStore((state) => state.selectedRepos);
  const setNodeSelection = useDashboardStore((state) => state.setNodeSelection);
  const clearNodeSelection = useDashboardStore((state) => state.clearNodeSelection);

  const pipelines = useMemo(
    () => dashboardData?.pipelines_stats ?? EMPTY_PIPELINES,
    [dashboardData],
  );

  const pipelineSources = useMemo(
    () =>
      Array.from(
        new Set(
          pipelines.flatMap((pipeline) =>
            pipeline.source_topics.map((id) => `source-${normalizeSourceId(id)}`),
          ),
        ),
      ),
    [pipelines],
  );
  const pipelineDestinations = useMemo(
    () =>
      Array.from(
        new Set(
          pipelines.map((pipeline) => `dest-${normalizeDestinationId(pipeline.destination_topic)}`),
        ),
      ),
    [pipelines],
  );

  const getDestinationsForSources = useCallback(
    (sourceIds: string[]) => {
      const sourceSet = new Set(sourceIds.map(normalizeSourceId));
      const dests = new Set<string>();

      pipelines.forEach((pipeline) => {
        if (pipeline.source_topics.some((sourceId) => sourceSet.has(normalizeSourceId(sourceId)))) {
          dests.add(`dest-${pipeline.destination_topic}`);
          dests.add(`dest-${normalizeDestinationId(pipeline.destination_topic)}`);
        }
      });

      if (!structure) return Array.from(dests);

      const visibleDestIds = new Set(
        structure.destinationTopics.slice(0, LAYOUT.maxVisibleNodes).map((t) => `dest-${t.id}`),
      );
      const hiddenDestIds = structure.destinationTopics
        .slice(LAYOUT.maxVisibleNodes)
        .map((t) => `dest-${t.id}`);

      const result = new Set<string>();
      let hasHiddenDests = false;

      dests.forEach((destId) => {
        if (visibleDestIds.has(destId)) {
          result.add(destId);
        } else if (hiddenDestIds.includes(destId)) {
          hasHiddenDests = true;
        }
      });

      if (hasHiddenDests) {
        result.add('dest-more');
      }

      return Array.from(result);
    },
    [pipelines, structure],
  );

  const getSourcesForSources = useCallback(
    (sourceIds: string[]) => {
      const sourceSet = new Set(sourceIds.map(normalizeSourceId));
      const sources = new Set<string>();

      pipelines.forEach((pipeline) => {
        if (pipeline.source_topics.some((sourceId) => sourceSet.has(normalizeSourceId(sourceId)))) {
          pipeline.source_topics.forEach((sourceId) => {
            sources.add(`source-${normalizeSourceId(sourceId)}`);
          });
        }
      });

      if (!structure) return Array.from(sources);

      const visibleSourceIds = new Set(
        structure.sourceTopics.slice(0, LAYOUT.maxVisibleNodes).map((t) => `source-${t.id}`),
      );
      const hiddenSourceIds = structure.sourceTopics
        .slice(LAYOUT.maxVisibleNodes)
        .map((t) => `source-${t.id}`);

      const result = new Set<string>();
      let hasHiddenSources = false;

      sources.forEach((sourceId) => {
        if (visibleSourceIds.has(sourceId)) {
          result.add(sourceId);
        } else if (hiddenSourceIds.includes(sourceId)) {
          hasHiddenSources = true;
        }
      });

      if (hasHiddenSources) {
        result.add('source-more');
      }

      return Array.from(result);
    },
    [pipelines, structure],
  );

  const getSourcesForDestinations = useCallback(
    (destinationIds: string[]) => {
      const destSet = new Set(destinationIds);
      const sources = new Set<string>();

      pipelines.forEach((pipeline) => {
        if (
          destSet.has(pipeline.destination_topic) ||
          destSet.has(normalizeDestinationId(pipeline.destination_topic))
        ) {
          pipeline.source_topics.forEach((sourceId) => {
            sources.add(`source-${normalizeSourceId(sourceId)}`);
          });
        }
      });

      if (!structure) return Array.from(sources);

      const visibleSourceIds = new Set(
        structure.sourceTopics.slice(0, LAYOUT.maxVisibleNodes).map((t) => `source-${t.id}`),
      );
      const hiddenSourceIds = structure.sourceTopics
        .slice(LAYOUT.maxVisibleNodes)
        .map((t) => `source-${t.id}`);

      const result = new Set<string>();
      let hasHiddenSources = false;

      sources.forEach((sourceId) => {
        if (visibleSourceIds.has(sourceId)) {
          result.add(sourceId);
        } else if (hiddenSourceIds.includes(sourceId)) {
          hasHiddenSources = true;
        }
      });

      if (hasHiddenSources) {
        result.add('source-more');
      }

      return Array.from(result);
    },
    [pipelines, structure],
  );

  const getRepositoriesForSources = useCallback(
    (sourceIds: string[]) => {
      const sourceSet = new Set(sourceIds.map(normalizeSourceId));
      const repos = new Set<string>();

      pipelines.forEach((pipeline) => {
        if (pipeline.source_topics.some((sourceId) => sourceSet.has(normalizeSourceId(sourceId)))) {
          (pipeline.repository_ids ?? []).forEach((repoId) => {
            repos.add(`repo-${normalizeRepositoryId(repoId)}`);
          });
        }
      });

      if (!structure) return Array.from(repos);

      const visibleRepoIds = new Set(
        structure.repositories.slice(0, LAYOUT.maxVisibleNodes).map((r) => `repo-${r.id}`),
      );
      const hiddenRepoIds = structure.repositories
        .slice(LAYOUT.maxVisibleNodes)
        .map((r) => `repo-${r.id}`);

      const result = new Set<string>();
      let hasHiddenRepos = false;

      repos.forEach((repoId) => {
        if (visibleRepoIds.has(repoId)) {
          result.add(repoId);
        } else if (hiddenRepoIds.includes(repoId)) {
          hasHiddenRepos = true;
        }
      });

      if (hasHiddenRepos) {
        result.add('repo-more');
      }

      return Array.from(result);
    },
    [pipelines, structure],
  );

  const getRepositoriesForDestinations = useCallback(
    (destinationIds: string[]) => {
      const destSet = new Set(destinationIds);
      const repos = new Set<string>();

      pipelines.forEach((pipeline) => {
        if (
          destSet.has(pipeline.destination_topic) ||
          destSet.has(normalizeDestinationId(pipeline.destination_topic))
        ) {
          (pipeline.repository_ids ?? []).forEach((repoId) => {
            repos.add(`repo-${normalizeRepositoryId(repoId)}`);
          });
        }
      });

      if (!structure) return Array.from(repos);

      const visibleRepoIds = new Set(
        structure.repositories.slice(0, LAYOUT.maxVisibleNodes).map((r) => `repo-${r.id}`),
      );
      const hiddenRepoIds = structure.repositories
        .slice(LAYOUT.maxVisibleNodes)
        .map((r) => `repo-${r.id}`);

      const result = new Set<string>();
      let hasHiddenRepos = false;

      repos.forEach((repoId) => {
        if (visibleRepoIds.has(repoId)) {
          result.add(repoId);
        } else if (hiddenRepoIds.includes(repoId)) {
          hasHiddenRepos = true;
        }
      });

      if (hasHiddenRepos) {
        result.add('repo-more');
      }

      return Array.from(result);
    },
    [pipelines, structure],
  );

  const getSourcesForRepositories = useCallback(
    (repoIds: string[]) => {
      const repoSet = new Set(repoIds.map(normalizeRepositoryId));
      const sources = new Set<string>();

      pipelines.forEach((pipeline) => {
        if ((pipeline.repository_ids ?? []).some((id) => repoSet.has(normalizeRepositoryId(id)))) {
          pipeline.source_topics.forEach((sourceId) => {
            sources.add(`source-${normalizeSourceId(sourceId)}`);
          });
        }
      });

      if (!structure) return Array.from(sources);

      const visibleSourceIds = new Set(
        structure.sourceTopics.slice(0, LAYOUT.maxVisibleNodes).map((t) => `source-${t.id}`),
      );
      const hiddenSourceIds = structure.sourceTopics
        .slice(LAYOUT.maxVisibleNodes)
        .map((t) => `source-${t.id}`);

      const result = new Set<string>();
      let hasHiddenSources = false;

      sources.forEach((sourceId) => {
        if (visibleSourceIds.has(sourceId)) {
          result.add(sourceId);
        } else if (hiddenSourceIds.includes(sourceId)) {
          hasHiddenSources = true;
        }
      });

      if (hasHiddenSources) {
        result.add('source-more');
      }

      return Array.from(result);
    },
    [pipelines, structure],
  );

  const getDestinationsForRepositories = useCallback(
    (repoIds: string[]) => {
      const repoSet = new Set(repoIds.map(normalizeRepositoryId));
      const destinations = new Set<string>();

      pipelines.forEach((pipeline) => {
        if ((pipeline.repository_ids ?? []).some((id) => repoSet.has(normalizeRepositoryId(id)))) {
          destinations.add(`dest-${pipeline.destination_topic}`);
          destinations.add(`dest-${normalizeDestinationId(pipeline.destination_topic)}`);
        }
      });

      if (!structure) return Array.from(destinations);

      const visibleDestIds = new Set(
        structure.destinationTopics.slice(0, LAYOUT.maxVisibleNodes).map((t) => `dest-${t.id}`),
      );
      const hiddenDestIds = structure.destinationTopics
        .slice(LAYOUT.maxVisibleNodes)
        .map((t) => `dest-${t.id}`);

      const result = new Set<string>();
      let hasHiddenDests = false;

      destinations.forEach((destId) => {
        if (visibleDestIds.has(destId)) {
          result.add(destId);
        } else if (hiddenDestIds.includes(destId)) {
          hasHiddenDests = true;
        }
      });

      if (hasHiddenDests) {
        result.add('dest-more');
      }

      return Array.from(result);
    },
    [pipelines, structure],
  );

  const handleSourceClick = useCallback(
    (sourceId: string) => {
      if (!structure) {
        return;
      }

      if (selectedNode?.id === sourceId && selectedNode?.type === 'source') {
        clearNodeSelection();
      } else {
        const sourceRawId = sourceId.replace('source-', '');
        const sources = getSourcesForSources([sourceRawId]);
        const destinations = getDestinationsForSources([sourceRawId]);
        const repos = getRepositoriesForSources([sourceRawId]);
        setNodeSelection({ id: sourceId, type: 'source' }, sources, destinations, repos);
      }
    },
    [
      selectedNode,
      structure,
      getSourcesForSources,
      getDestinationsForSources,
      getRepositoriesForSources,
      setNodeSelection,
      clearNodeSelection,
    ],
  );

  const handleDestinationClick = useCallback(
    (destId: string) => {
      if (!structure) return;

      if (selectedNode?.id === destId && selectedNode?.type === 'destination') {
        clearNodeSelection();
      } else {
        const destRawId = destId.replace('dest-', '');
        const sources = getSourcesForDestinations([destRawId]);
        const repos = getRepositoriesForDestinations([destRawId]);
        setNodeSelection({ id: destId, type: 'destination' }, sources, [destId], repos);
      }
    },
    [
      selectedNode,
      structure,
      getSourcesForDestinations,
      getRepositoriesForDestinations,
      setNodeSelection,
      clearNodeSelection,
    ],
  );

  const handleRepositoryClick = useCallback(
    (repoId: string) => {
      if (!structure) return;

      if (selectedNode?.id === repoId && selectedNode?.type === 'repository') {
        clearNodeSelection();
      } else {
        const repoRawId = repoId.replace('repo-', '');
        const sources = getSourcesForRepositories([repoRawId]);
        const destinations = getDestinationsForRepositories([repoRawId]);
        setNodeSelection({ id: repoId, type: 'repository' }, sources, destinations, [repoId]);
      }
    },
    [
      selectedNode,
      structure,
      getSourcesForRepositories,
      getDestinationsForRepositories,
      setNodeSelection,
      clearNodeSelection,
    ],
  );

  const handleSourceMoreClick = useCallback(() => {
    if (!structure) {
      return;
    }

    if (selectedNode?.id === 'source-more' && selectedNode.type === 'sourceMore') {
      clearNodeSelection();
      return;
    }

    const hiddenSourceIds = structure.sourceTopics
      .slice(LAYOUT.maxVisibleNodes)
      .map((topic) => topic.id);
    const destinations = getDestinationsForSources(hiddenSourceIds);
    const repos = getRepositoriesForSources(hiddenSourceIds);
    setNodeSelection(
      { id: 'source-more', type: 'sourceMore' },
      ['source-more'],
      destinations,
      repos,
    );
  }, [
    structure,
    selectedNode,
    getDestinationsForSources,
    getRepositoriesForSources,
    setNodeSelection,
    clearNodeSelection,
  ]);

  const handleDestMoreClick = useCallback(() => {
    if (!structure) {
      return;
    }

    if (selectedNode?.id === 'dest-more' && selectedNode.type === 'destMore') {
      clearNodeSelection();
      return;
    }

    const hiddenDestIds = structure.destinationTopics
      .slice(LAYOUT.maxVisibleNodes)
      .map((topic) => topic.id);
    const sources = getSourcesForDestinations(hiddenDestIds);
    const repos = getRepositoriesForDestinations(hiddenDestIds);
    setNodeSelection({ id: 'dest-more', type: 'destMore' }, sources, ['dest-more'], repos);
  }, [
    structure,
    selectedNode,
    getSourcesForDestinations,
    getRepositoriesForDestinations,
    setNodeSelection,
    clearNodeSelection,
  ]);

  const handleRepoMoreClick = useCallback(() => {
    if (!structure) {
      return;
    }

    if (selectedNode?.id === 'repo-more' && selectedNode.type === 'repoMore') {
      clearNodeSelection();
      return;
    }

    setNodeSelection({ id: 'repo-more', type: 'repoMore' }, pipelineSources, pipelineDestinations, [
      'repo-more',
    ]);
  }, [
    structure,
    selectedNode,
    pipelineSources,
    pipelineDestinations,
    setNodeSelection,
    clearNodeSelection,
  ]);

  return {
    selectedNode,
    selectedRepos,
    selectedDestinations,
    selectedSources,
    handleSourceClick,
    handleDestinationClick,
    handleSourceMoreClick,
    handleDestMoreClick,
    handleRepositoryClick,
    handleRepoMoreClick,
  };
};
