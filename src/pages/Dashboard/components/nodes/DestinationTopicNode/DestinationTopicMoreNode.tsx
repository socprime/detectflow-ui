import { useThemeColors } from '@/hooks';
import { useDashboardStore } from '@/store/dashboard';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { MoreNodeData } from '../../../types';
import { ANIMATION, LAYOUT } from '../../../utils/constants';

interface DestinationTopicMoreNodeProps {
  data: MoreNodeData;
  id: string;
}

export const DestinationTopicMoreNode = ({ data, id }: DestinationTopicMoreNodeProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { primary, default: textDefault } = useThemeColors();
  const structure = useDashboardStore((state) => state.dashboardStructure);
  const selectedNode = useDashboardStore((state) => state.selectedNode);
  const selectedDestinations = useDashboardStore((state) => state.selectedDestinations);

  const isSelected = selectedDestinations.includes('dest-more');
  const isDimmed = selectedNode !== null && !isSelected;

  const hiddenCount = useMemo(() => {
    if (!structure) {
      return 0;
    }
    return Math.max(0, structure.destinationTopics.length - LAYOUT.maxVisibleTopics);
  }, [structure]);

  if (hiddenCount === 0) {
    return null;
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000 + (data.index || 0) * 150);
    return () => clearTimeout(timer);
  }, [data.index]);

  return (
    <motion.div
      key={id}
      className="pointer-events-all border-purple relative max-w-[180px] min-w-[180px] cursor-pointer overflow-hidden border-l-2 px-4 py-2 shadow-xl"
      style={{ backgroundColor: primary }}
      initial={{ opacity: 0, x: 50 }}
      animate={
        isVisible
          ? {
              opacity: isDimmed ? 0.3 : 1,
              x: 0,
              scale: isSelected ? 1.05 : 1,
            }
          : { opacity: 0, x: 50 }
      }
      transition={{
        duration: ANIMATION.nodeAnimationDuration,
        scale: { duration: 0.3, ease: 'easeOut' },
        opacity: { duration: 0.4, ease: 'easeInOut' },
      }}
    >
      <Handle className="bg-purple opacity-0" type="target" position={Position.Left} />
      <div className="relative z-10 text-sm italic" style={{ color: textDefault }}>
        {`+ ${hiddenCount} more`}
      </div>
    </motion.div>
  );
};
