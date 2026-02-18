import { useThemeColors } from '@/hooks';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import type { TopicNodeData } from '../../../types';
import { ANIMATION } from '../../../utils/constants';

interface SourceTopicNodeProps {
  data: TopicNodeData;
  id: string;
}

export const SourceTopicNode = ({ data, id }: SourceTopicNodeProps) => {
  const { primary, default: textDefault } = useThemeColors();
  const delay = useMemo(() => Math.random() * 2, []);
  const repeatDelay = useMemo(() => [1, 2, 4][Math.floor(Math.random() * 3)], []);
  const [isVisible, setIsVisible] = useState(false);
  const isSelected = data.isSelected || false;
  const isDimmed = data.isDimmed || false;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), (data.index || 0) * ANIMATION.staggerDelay);
    return () => clearTimeout(timer);
  }, [data.index]);

  return (
    <motion.div
      key={id}
      className="border-light-blue pointer-events-all relative max-w-[180px] min-w-[180px] cursor-pointer overflow-hidden border-r-2 px-4 py-2 shadow-xl"
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
      <Handle className="bg-light-blue right-0 opacity-0" type="source" position={Position.Right} />
      <div
        className="relative z-10 truncate text-xs"
        title={data.label}
        style={{ color: textDefault }}
      >
        {data.label}
      </div>
      <motion.div
        className="via-light-blue/20 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay,
          repeatDelay: repeatDelay,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
};
