import { useThemeColors } from '@/hooks';
import { useDashboardStore } from '@/store/dashboard';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { ANIMATION, LAYOUT } from '../../../utils/constants';

import type { MoreNodeData } from '../../../types';

interface SourceTopicMoreNodeProps {
  data: MoreNodeData;
  id: string;
}

export const SourceTopicMoreNode = ({ data, id }: SourceTopicMoreNodeProps) => {
  const { primary, default: textDefault } = useThemeColors();
  const structure = useDashboardStore((state) => state.dashboardStructure);
  const selectedNode = useDashboardStore((state) => state.selectedNode);
  const selectedSources = useDashboardStore((state) => state.selectedSources);
  const [isVisible, setIsVisible] = useState(false);

  const isSelected = selectedSources.includes('source-more');
  const isDimmed = selectedNode !== null && !isSelected;

  const hiddenCount = useMemo(() => {
    if (!structure) {
      return 0;
    }
    return Math.max(0, structure.sourceTopics.length - LAYOUT.maxVisibleTopics);
  }, [structure]);

  if (hiddenCount === 0) {
    return null;
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), (data.index || 0) * ANIMATION.staggerDelay);
    return () => clearTimeout(timer);
  }, [data.index]);

  return (
    <motion.div
      key={id}
      className="pointer-events-all border-light-blue relative max-w-[180px] min-w-[180px] cursor-pointer overflow-hidden border-r-2 px-4 py-2"
      style={{ backgroundColor: primary }}
      initial={{ opacity: 0, x: -50 }}
      animate={
        isVisible
          ? {
              opacity: isDimmed ? 0.3 : 1,
              x: 0,
              scale: isSelected ? 1.05 : 1,
            }
          : { opacity: 0, x: -50 }
      }
      transition={{
        duration: ANIMATION.nodeAnimationDuration,
        scale: { duration: 0.3, ease: 'easeOut' },
        opacity: { duration: 0.4, ease: 'easeInOut' },
      }}
    >
      <Handle className="bg-light-blue opacity-0" type="source" position={Position.Right} />
      <div className="relative z-10 text-xs italic opacity-70" style={{ color: textDefault }}>
        {`+ ${hiddenCount} more`}
      </div>
    </motion.div>
  );
};
