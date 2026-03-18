import { useDashboardStore } from '@/store/dashboard';
import type { Node } from '@xyflow/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LAYOUT } from '../utils/constants';
import { useNodeSelection } from './useNodeSelection';

export const useDashboardNodes = () => {
  const metricMode = useDashboardStore((state) => state.metricMode);
  const dashboardStructure = useDashboardStore((state) => state.dashboardStructure);
  const dashboardValues = useDashboardStore((state) => state.dashboardValues);
  const selectedNode = useDashboardStore((state) => state.selectedNode);
  const selectedSources = useDashboardStore((state) => state.selectedSources);
  const selectedDestinations = useDashboardStore((state) => state.selectedDestinations);
  const selectedRepos = useDashboardStore((state) => state.selectedRepos);

  const structure = dashboardStructure;
  const values = dashboardValues;

  const {
    handleSourceClick,
    handleDestinationClick,
    handleSourceMoreClick,
    handleDestMoreClick,
    handleRepositoryClick,
    handleRepoMoreClick,
  } = useNodeSelection();

  const [containerWidth, setContainerWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.max(1200, window.innerWidth);
    }
    return 1920;
  });

  useEffect(() => {
    const update = () => {
      const newWidth = Math.max(1200, window.innerWidth);
      setContainerWidth(newWidth);
    };

    update();

    const timeoutId = setTimeout(update, 100);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(update, 100);
      }
    };

    window.addEventListener('resize', update);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', update);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const nodes = useMemo<Node[]>(() => {
    if (!structure || !values) return [];

    const nodesList: Node[] = [];
    const centerY = LAYOUT.centerY;
    const centerX = (containerWidth - LAYOUT.centerNodeWidth) / 2;
    const edgeMargin = LAYOUT.edgeMargin;

    nodesList.push({
      id: 'central-pipelines',
      type: 'pipelines',
      position: { x: centerX, y: centerY },
      data: {},
    });

    const visibleSourceTopics = structure.sourceTopics.slice(0, LAYOUT.maxVisibleNodes);

    const sourceStartY = centerY - 40 - (visibleSourceTopics.length * LAYOUT.verticalSpacing) / 2;

    nodesList.push({
      id: 'source-topics-label',
      type: 'sourceTopicsLabel',
      position: { x: edgeMargin, y: sourceStartY - 50 },
      data: {},
    });

    visibleSourceTopics.forEach((topic, i) => {
      const nodeId = `source-${topic.id}`;
      nodesList.push({
        id: nodeId,
        type: 'sourceTopic',
        position: { x: edgeMargin, y: sourceStartY + i * LAYOUT.verticalSpacing },
        data: {
          label: topic.name,
          index: i,
          isSelected: selectedSources.includes(nodeId),
          isDimmed: selectedNode !== null && !selectedSources.includes(nodeId),
        },
      });
    });

    if (structure.sourceTopics.length > LAYOUT.maxVisibleNodes) {
      nodesList.push({
        id: 'source-more',
        type: 'moreSourceTopics',
        position: {
          x: edgeMargin,
          y: sourceStartY + visibleSourceTopics.length * LAYOUT.verticalSpacing,
        },
        data: {
          type: 'source',
          index: visibleSourceTopics.length,
          isSelected: selectedSources.includes('source-more'),
          isDimmed: selectedNode !== null && !selectedSources.includes('source-more'),
        },
      });
    }

    const sourceAggX =
      edgeMargin +
      LAYOUT.topicNodeWidth +
      (centerX - edgeMargin - LAYOUT.topicNodeWidth) / 2 -
      LAYOUT.aggregationNodeWidth / 2;
    nodesList.push({
      id: 'source-aggregation',
      type: 'sourceAggregation',
      position: { x: sourceAggX, y: centerY },
      data: {},
    });

    const repoStartY = centerY + 225;
    nodesList.push({
      id: 'repositories-label',
      type: 'repositoriesLabel',
      position: { x: edgeMargin, y: repoStartY - 50 },
      data: {},
    });

    const visibleRepos = structure.repositories.slice(0, LAYOUT.maxVisibleNodes);

    visibleRepos.forEach((repo, i) => {
      const nodeId = `repo-${repo.id}`;

      nodesList.push({
        id: nodeId,
        type: 'repository',
        position: { x: edgeMargin, y: repoStartY + i * LAYOUT.verticalSpacing },
        data: {
          label: repo.name,
          index: i,
          isSelected: selectedRepos.includes(nodeId),
          isDimmed: selectedRepos.length > 0 && !selectedRepos.includes(nodeId),
        },
      });
    });

    if (structure.repositories.length > LAYOUT.maxVisibleNodes) {
      nodesList.push({
        id: 'repo-more',
        type: 'moreRepositories',
        position: { x: edgeMargin, y: repoStartY + visibleRepos.length * LAYOUT.verticalSpacing },
        data: {},
      });
    }

    const repoAggX =
      edgeMargin +
      LAYOUT.topicNodeWidth +
      (centerX - edgeMargin - LAYOUT.topicNodeWidth) / 2 -
      LAYOUT.aggregationNodeWidth / 2;
    nodesList.push({
      id: 'repo-aggregation',
      type: 'repositoryAggregation',
      position: { x: repoAggX, y: centerY + 265 },
      data: {},
    });

    const visibleDestTopics = structure.destinationTopics.slice(0, LAYOUT.maxVisibleNodes);
    const destStartY = centerY + 125 - (visibleDestTopics.length * LAYOUT.verticalSpacing) / 2;
    const destX = containerWidth - edgeMargin - LAYOUT.topicNodeWidth;

    nodesList.push({
      id: 'destination-topics-label',
      type: 'destinationTopicsLabel',
      position: { x: destX, y: destStartY - 50 },
      data: {},
    });

    visibleDestTopics.forEach((topic, i) => {
      const nodeId = `dest-${topic.id}`;
      nodesList.push({
        id: nodeId,
        type: 'destinationTopic',
        position: { x: destX, y: destStartY + i * LAYOUT.verticalSpacing },
        data: {
          label: topic.name,
          index: i,
          isSelected: selectedDestinations.includes(nodeId),
          isDimmed: selectedNode !== null && !selectedDestinations.includes(nodeId),
        },
      });
    });

    if (structure.destinationTopics.length > LAYOUT.maxVisibleNodes) {
      nodesList.push({
        id: 'dest-more',
        type: 'moreDestinationTopics',
        position: { x: destX, y: destStartY + visibleDestTopics.length * LAYOUT.verticalSpacing },
        data: {
          type: 'destination',
          index: visibleDestTopics.length,
          isSelected: selectedDestinations.includes('dest-more'),
          isDimmed: selectedNode !== null && !selectedDestinations.includes('dest-more'),
        },
      });
    }

    const destAggX =
      centerX +
      LAYOUT.centerNodeWidth +
      (destX - centerX - LAYOUT.centerNodeWidth) / 2 -
      LAYOUT.aggregationNodeWidth / 2;
    nodesList.push({
      id: 'destination-aggregation',
      type: 'destinationAggregation',
      position: { x: destAggX, y: centerY + 85 },
      data: {},
    });

    return nodesList;
  }, [
    structure,
    values,
    containerWidth,
    metricMode,
    selectedNode,
    selectedSources,
    selectedDestinations,
    selectedRepos,
  ]);

  const handleNodeClick = useCallback(
    (_: any, node: Node) => {
      if (
        node.id === 'source-aggregation' ||
        node.id === 'destination-aggregation' ||
        node.id === 'repo-aggregation'
      ) {
        return;
      }

      if (node.id === 'source-more') return handleSourceMoreClick();
      if (node.id === 'dest-more') return handleDestMoreClick();
      if (node.id === 'repo-more') return handleRepoMoreClick();
      if (node.id.startsWith('source-')) return handleSourceClick(node.id);
      if (node.id.startsWith('dest-')) return handleDestinationClick(node.id);
      if (node.id.startsWith('repo-')) return handleRepositoryClick(node.id);
    },
    [
      handleSourceClick,
      handleDestinationClick,
      handleRepositoryClick,
      handleSourceMoreClick,
      handleDestMoreClick,
      handleRepoMoreClick,
    ],
  );

  return {
    nodes,
    selectedNode,
    selectedSources,
    selectedDestinations,
    selectedRepos,
    handleNodeClick,
  };
};
