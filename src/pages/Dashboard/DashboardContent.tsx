import { ConditionalContent } from '@/components/ConditionalContent';
import { SpinnerSquare } from '@/components/Loading';
import { ConnectionLineType, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { memo } from 'react';
import * as Nodes from './components';
import { DashboardEmptyState } from './DashboardEmptyState';
import { useDashboardData } from './hooks/useDashboardData';

const nodeTypes = {
  sourceTopic: Nodes.SourceTopicNode,
  sourceTopicsLabel: Nodes.SourceTopicLabelNode,
  moreSourceTopics: Nodes.SourceTopicMoreNode,
  repository: Nodes.RepositoryNode,
  repositoriesLabel: Nodes.RepositoryLabelNode,
  moreRepositories: Nodes.RepositoryMoreNode,
  destinationTopic: Nodes.DestinationTopicNode,
  destinationTopicsLabel: Nodes.DestinationTopicLabelNode,
  moreDestinationTopics: Nodes.DestinationTopicMoreNode,
  sourceAggregation: Nodes.SourceTopicAggregationNode,
  repositoryAggregation: Nodes.RepositoryAggregationNode,
  destinationAggregation: Nodes.DestinationTopicAggregationNode,
  pipelines: Nodes.PipelinesNode,
};

const edgeTypes = {
  animated: Nodes.AnimatedEdge,
};

const defaultEdgeOptions = {
  type: 'animated',
};

const DashboardContentInner: React.FC = () => {
  const {
    loading,
    hasDashboardGraph,
    containerRef,
    reactFlowInstanceRef,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    handleNodeClick,
  } = useDashboardData();

  if (!hasDashboardGraph && !loading) {
    return <DashboardEmptyState />;
  }

  return (
    <ConditionalContent
      loading={loading}
      loadingContent={<SpinnerSquare variant="absolute" />}
      loadedContent={
        <div ref={containerRef} className="h-full w-full max-w-full overflow-hidden">
          <ReactFlow
            className="ml-[-16px] bg-transparent"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={(instance) => {
              reactFlowInstanceRef.current = instance;
              setTimeout(() => {
                instance.fitView({ padding: 0.1, duration: 0 });
              }, 100);
            }}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionLineType={ConnectionLineType.Bezier}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            proOptions={{ hideAttribution: true }}
            minZoom={0.5}
            maxZoom={2}
            panOnDrag={true}
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            onNodeClick={handleNodeClick}
            defaultEdgeOptions={defaultEdgeOptions}
          />
        </div>
      }
    />
  );
};

export const DashboardContent = memo(DashboardContentInner);
