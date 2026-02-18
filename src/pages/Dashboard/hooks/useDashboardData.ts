import { useDashboardStore } from '@/store/dashboard';
import { ReactFlowInstance, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect, useRef } from 'react';
import { useDashboardEdges } from './useDashboardEdges';
import { useDashboardNodes } from './useDashboardNodes';

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
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesFromHook);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesFromHook || []);
  const hasInitializedRef = useRef(false);
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isEdgeDimmed = useCallback(
    (edgeId: string, source: string, target: string) => {
      if (!selectedNode) return false;

      const selectedSourceSet = new Set(selectedSources);
      const selectedDestSet = new Set(selectedDestinations);
      const selectedRepoSet = new Set(selectedRepos);

      if (source.startsWith('source-') && source !== 'source-aggregation') {
        return !selectedSourceSet.has(source);
      }

      if (source.startsWith('repo-') && source !== 'repo-aggregation') {
        if (selectedRepos.length > 0) {
          return !selectedRepoSet.has(source);
        }
        return false;
      }

      if (target.startsWith('dest-') && target !== 'destination-aggregation') {
        return !selectedDestSet.has(target);
      }

      if (source === 'source-aggregation') {
        return selectedSources.length === 0;
      }

      if (source === 'repo-aggregation') {
        return selectedRepos.length === 0;
      }

      if (source === 'central-pipelines') {
        return selectedDestinations.length === 0;
      }

      if (target === 'destination-aggregation') {
        return selectedDestinations.length === 0;
      }

      return false;
    },
    [selectedNode, selectedSources, selectedDestinations, selectedRepos],
  );

  useEffect(() => {
    const store = useDashboardStore.getState();

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;

      store.fetchSnapshot().then(() => {
        store.initializeSSE();
      });
    }

    return () => {
      if (hasInitializedRef.current) {
        store.disconnectSSE();
        hasInitializedRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    setNodes((currentNodes) =>
      nodesFromHook.map((newNode) => {
        const existingNode = currentNodes.find((n) => n.id === newNode.id);
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
      }),
    );
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

    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current);
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
  }, []);

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
