import { ReactFlowInstance, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NODE_IDS } from '../utils/constants';
import { useDashboardEdges } from './useDashboardEdges';
import { useDashboardNodes } from './useDashboardNodes';

import { useDashboardStore } from '@/store/dashboard';

export const useDashboardData = () => {
  const loading = useDashboardStore((state) => state.loading);
  const hasDashboardData = useDashboardStore(
    (state) => !!state.dashboardData && state.dashboardData.pipelines_stats.length > 0,
  );
  const { edges: edgesFromHook } = useDashboardEdges();
  const {
    nodes: nodesFromHook,
    handleNodeClick,
    selectedNode,
    selectedSources,
    selectedDestinations,
    selectedRepos,
  } = useDashboardNodes();
  const fetchSnapshot = useDashboardStore((state) => state.fetchSnapshot);
  const initializeSSE = useDashboardStore((state) => state.initializeSSE);
  const disconnectSSE = useDashboardStore((state) => state.disconnectSSE);
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesFromHook);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesFromHook || []);
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerNode(node);
  }, []);

  const isEdgeDimmed = useCallback(
    (edgeId: string, source: string, target: string) => {
      if (!selectedNode) return false;

      const selectedSourceSet = new Set(selectedSources);
      const selectedDestSet = new Set(selectedDestinations);
      const selectedRepoSet = new Set(selectedRepos);

      if (source.startsWith('source-') && source !== NODE_IDS.SOURCE_AGG) {
        return !selectedSourceSet.has(source);
      }

      if (source.startsWith('repo-') && source !== NODE_IDS.REPO_AGG) {
        if (selectedRepos.length > 0) {
          return !selectedRepoSet.has(source);
        }
        return false;
      }

      if (target.startsWith('dest-') && target !== NODE_IDS.DEST_AGG) {
        return !selectedDestSet.has(target);
      }

      if (source === NODE_IDS.SOURCE_AGG) {
        return selectedSources.length === 0;
      }

      if (source === NODE_IDS.REPO_AGG) {
        return selectedRepos.length === 0;
      }

      if (source === NODE_IDS.PIPELINES) {
        return selectedDestinations.length === 0;
      }

      if (target === NODE_IDS.DEST_AGG) {
        return selectedDestinations.length === 0;
      }

      return false;
    },
    [selectedNode, selectedSources, selectedDestinations, selectedRepos],
  );

  useEffect(() => {
    let isMounted = true;
    fetchSnapshot().then(() => {
      if (isMounted) {
        initializeSSE();
      }
    });
    return () => {
      isMounted = false;
      disconnectSSE();
    };
  }, [fetchSnapshot, initializeSSE, disconnectSSE]);

  useEffect(() => {
    setNodes((currentNodes) => {
      const currentNodesMap = new Map(currentNodes.map((n) => [n.id, n]));

      return nodesFromHook.map((newNode) => {
        const existingNode = currentNodesMap.get(newNode.id);
        if (existingNode) {
          const positionChanged =
            existingNode.position.x !== newNode.position.x ||
            existingNode.position.y !== newNode.position.y;

          if (!positionChanged) {
            return {
              ...existingNode,
              data: newNode.data,
            };
          }
        }
        return newNode;
      });
    });
  }, [nodesFromHook]);

  useEffect(() => {
    if (edgesFromHook) {
      const updatedEdges = edgesFromHook.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          isDimmed: isEdgeDimmed(edge.id, edge.source, edge.target),
        },
      }));
      setEdges(updatedEdges);
    }
  }, [edgesFromHook, isEdgeDimmed]);

  useEffect(() => {
    if (hasDashboardData && nodes.length > 0 && reactFlowInstanceRef.current) {
      const timer = setTimeout(() => {
        reactFlowInstanceRef.current?.fitView({ padding: 0.1, duration: 0 });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hasDashboardData, nodes.length]);

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        if (reactFlowInstanceRef.current) {
          reactFlowInstanceRef.current.fitView({ padding: 0.1, duration: 0 });
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;

    if (containerNode && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerNode);
    }

    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [containerNode]);

  return {
    nodes,
    edges,
    loading,
    hasDashboardGraph: hasDashboardData,
    containerRef,
    reactFlowInstanceRef,
    onNodesChange,
    onEdgesChange,
    handleNodeClick,
  };
};
