import { useThemeColors } from '@/hooks';
import { useDashboardStore } from '@/store/dashboard';
import { Handle, Position } from '@xyflow/react';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useMemo } from 'react';

export const DestinationTopicAggregationNode = memo(() => {
  const { primary, default: textDefault } = useThemeColors();
  const metricMode = useDashboardStore((state) => state.metricMode);
  const structure = useDashboardStore((state) => state.dashboardStructure);
  const values = useDashboardStore((state) => state.dashboardValues);
  const selectedNode = useDashboardStore((state) => state.selectedNode);
  const selectedDestinations = useDashboardStore((state) => state.selectedDestinations);

  const { taggedValue, untaggedValue } = useMemo(() => {
    if (!structure || !values) {
      return { taggedValue: 0, untaggedValue: 0 };
    }

    if (!selectedNode) {
      return {
        taggedValue: values.destinationTopicsTotal.tagged,
        untaggedValue: 0,
      };
    }

    let destTagged = 0;
    let destUntagged = 0;

    selectedDestinations.forEach((nodeId) => {
      if (nodeId === 'dest-more') {
        const collapsedDests = structure.destinationTopics.slice(4);
        destTagged += collapsedDests.reduce((sum, t) => sum + t.taggedEps, 0);
        destUntagged += collapsedDests.reduce((sum, t) => sum + t.untaggedEps, 0);
      } else {
        const topicId = nodeId.replace('dest-', '');
        const topic = structure.destinationTopics.find((t) => t.id === topicId);
        if (topic) {
          destTagged += topic.taggedEps;
          destUntagged += topic.untaggedEps;
        }
      }
    });

    return {
      taggedValue: Math.round(destTagged * 100) / 100,
      untaggedValue: Math.round(destUntagged * 100) / 100,
    };
  }, [structure, values, selectedNode, selectedDestinations]);

  const showUntagged = selectedNode !== null;

  return (
    <motion.div
      className="min-w-[120px] cursor-default rounded-lg shadow-xl"
      style={{ backgroundColor: primary }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: showUntagged ? -20 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Handle className="bg-purple opacity-0" type="target" position={Position.Left} />
      <Handle className="bg-purple opacity-0" type="source" position={Position.Right} />
      <div className="border-purple bg-purple/20 rounded-lg border py-2 pr-1.5 pl-1.5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="bg-purple h-2 w-2 rounded-full" />
            <div className="bg-purple absolute inset-0 h-2 w-2 animate-ping rounded-full opacity-75" />
          </div>
          <div className="text-3xs tracking-wider uppercase" style={{ color: textDefault }}>
            {metricMode === 'events' ? 'Tagged/sec' : 'Gb/sec'}
          </div>
        </div>
        <div className="text-purple pl-0.5 text-2xl">{taggedValue.toLocaleString()}</div>
        <AnimatePresence>
          {showUntagged && (
            <motion.div
              className="border-purple/30 mt-2 border-t pt-2"
              initial={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 8, paddingTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="bg-gray-chateau h-2 w-2 rounded-full" />
                  <div className="bg-gray-chateau absolute inset-0 h-2 w-2 animate-ping rounded-full opacity-75" />
                </div>
                <div className="text-3xs tracking-wider uppercase" style={{ color: textDefault }}>
                  {metricMode === 'events' ? 'Untagged/sec' : 'Gb/sec'}
                </div>
              </div>
              <div className="text-purple/80 text-lg">{untaggedValue.toLocaleString()}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});
