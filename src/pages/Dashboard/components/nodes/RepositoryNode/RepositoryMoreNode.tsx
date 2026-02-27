import { useThemeColors } from '@/hooks';
import { useDashboardStore } from '@/store/dashboard';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { MoreNodeData } from '../../../types';
import { ANIMATION, LAYOUT } from '../../../utils/constants';

interface RepositoryMoreNodeProps {
  data: MoreNodeData;
  id: string;
}

export const RepositoryMoreNode = ({ data, id }: RepositoryMoreNodeProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { primary, default: textDefault } = useThemeColors();
  const structure = useDashboardStore((state) => state.dashboardStructure);
  const selectedRepos = useDashboardStore((state) => state.selectedRepos);

  const isSelected = selectedRepos.includes('repo-more');
  const isDimmed = selectedRepos.length > 0 && !isSelected;

  const hiddenCount = useMemo(() => {
    if (!structure) {
      return 0;
    }
    return Math.max(0, structure.repositories.length - LAYOUT.maxVisibleTopics);
  }, [structure]);

  if (hiddenCount === 0) {
    return null;
  }
  useEffect(() => {
    const timer = setTimeout(
      () => setIsVisible(true),
      500 + (data.index || 0) * ANIMATION.staggerDelay,
    );
    return () => clearTimeout(timer);
  }, [data.index]);

  return (
    <motion.div
      key={id}
      className="border-success pointer-events-all relative max-w-[180px] min-w-[180px] cursor-pointer overflow-hidden border-r-2 px-4 py-2 shadow-xl"
      style={{ backgroundColor: primary }}
      initial={{ opacity: 0, x: -50 }}
      animate={
        isVisible
          ? {
              opacity: isDimmed ? 0.5 : 1,
              x: 0,
              scale: isSelected ? 1.05 : 1,
            }
          : { opacity: 0, x: -50 }
      }
      transition={{ duration: ANIMATION.nodeAnimationDuration }}
    >
      <Handle className="bg-success opacity-0" type="source" position={Position.Right} />
      <div className="relative z-10 text-sm italic" style={{ color: textDefault }}>
        {`+ ${hiddenCount} more`}
      </div>
    </motion.div>
  );
};
