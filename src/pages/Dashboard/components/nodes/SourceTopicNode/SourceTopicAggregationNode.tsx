import { useThemeColors } from '@/hooks';
import { useDashboardStore } from '@/store/dashboard';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { memo, useMemo } from 'react';

export const SourceTopicAggregationNode = memo(() => {
  const { primary, default: textDefault } = useThemeColors();
  const metricMode = useDashboardStore((state) => state.metricMode);
  const structure = useDashboardStore((state) => state.dashboardStructure);
  const values = useDashboardStore((state) => state.dashboardValues);
  const selectedNode = useDashboardStore((state) => state.selectedNode);
  const selectedSources = useDashboardStore((state) => state.selectedSources);

  const displayValue = useMemo(() => {
    if (!structure || !values) return 0;

    if (!selectedNode) {
      return values.sourceTopicsTotal.events;
    }

    let totalEvents = 0;
    selectedSources.forEach((nodeId) => {
      if (nodeId === 'source-more') {
        const collapsedSources = structure.sourceTopics.slice(4);
        totalEvents += collapsedSources.reduce((sum, s) => sum + s.eps, 0);
      } else {
        const sourceId = nodeId.replace('source-', '');
        const source = structure.sourceTopics.find((s) => s.id === sourceId);
        if (source) {
          totalEvents += source.eps;
        }
      }
    });

    if (
      selectedNode.type !== 'repository' &&
      selectedNode.type !== 'repoMore' &&
      selectedSources.length === 0
    ) {
      return values.sourceTopicsTotal.events;
    }

    return totalEvents;
  }, [structure, values, selectedNode, selectedSources]);

  return (
    <motion.div
      className="min-w-[120px] cursor-default rounded-lg shadow-xl"
      style={{ backgroundColor: primary }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Handle className="bg-light-blue opacity-0" type="target" position={Position.Left} />
      <Handle className="bg-light-blue opacity-0" type="source" position={Position.Right} />
      <div className="border-light-blue bg-light-blue/20 rounded-lg border py-2 pr-1.5 pl-1.5">
        <div className="mb-1 flex items-center gap-2">
          <div className="relative">
            <div className="bg-light-blue h-2 w-2 rounded-full" />
            <div className="bg-light-blue absolute inset-0 h-2 w-2 animate-ping rounded-full opacity-75" />
          </div>
          <div className="text-3xs tracking-wider uppercase" style={{ color: textDefault }}>
            {metricMode === 'events' ? 'Events/sec' : 'Gb/sec'}
          </div>
        </div>
        <div className="text-light-blue pl-0.5 text-2xl">{displayValue.toLocaleString()}</div>
      </div>
    </motion.div>
  );
});
