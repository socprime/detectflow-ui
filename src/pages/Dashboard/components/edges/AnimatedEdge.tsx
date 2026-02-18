import { useThemeColors } from '@/hooks/useThemeColors';
import type { EdgeProps } from '@xyflow/react';
import { getBezierPath } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

export const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) => {
  const initialCoordsRef = useRef({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const coords = initialCoordsRef.current;

  const [edgePath] = getBezierPath({
    sourceX: coords.sourceX,
    sourceY: coords.sourceY,
    sourcePosition: coords.sourcePosition,
    targetX: coords.targetX,
    targetY: coords.targetY,
    targetPosition: coords.targetPosition,
  });
  const { success } = useThemeColors();

  const color = (data?.color as string) || success;
  const particleCount = (data?.particleCount as number) || 2;
  const shape = data?.shape || 'circle';
  const delay = (data?.animationDelay as number) || 0;
  const shouldAnimateOnMount = data?.shouldAnimateOnMount !== false;
  const isDimmed = (data?.isDimmed as boolean) || false;
  const disableAnimation = (data?.disableAnimation as boolean) || false;

  const hasCompletedInitialAnimation = useRef(false);
  const [visible, setVisible] = useState(() => {
    if (!shouldAnimateOnMount) return true;
    if (hasCompletedInitialAnimation.current) return true;
    return false;
  });

  useEffect(() => {
    if (visible || hasCompletedInitialAnimation.current) return;

    if (shouldAnimateOnMount) {
      const t = setTimeout(() => {
        setVisible(true);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [delay, shouldAnimateOnMount, visible]);

  useEffect(() => {
    if (visible && !hasCompletedInitialAnimation.current) {
      const t = setTimeout(() => {
        hasCompletedInitialAnimation.current = true;
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const glowId = `glow-${id}`;

  const particleDurations = useMemo(
    () => Array.from({ length: particleCount }, () => 2 + Math.random() * 1.5),
    [id, particleCount],
  );

  return (
    <>
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={style.strokeWidth}
        opacity={isDimmed ? 0.1 : (style.opacity ?? 0.42)}
        initial={hasCompletedInitialAnimation.current ? false : { pathLength: 0, opacity: 0 }}
        animate={
          visible
            ? { pathLength: 1, opacity: isDimmed ? 0.1 : (style.opacity ?? 0.42) }
            : { pathLength: 0, opacity: 0 }
        }
        transition={
          hasCompletedInitialAnimation.current
            ? { duration: 0.2 }
            : { duration: 1, ease: 'easeInOut' }
        }
      />
      {visible &&
        !isDimmed &&
        !disableAnimation &&
        Array.from({ length: particleCount }, (_, i) => {
          const commonProps = {
            fill: color,
            filter: `url(#${glowId})`,
            opacity: 0,
          };

          const animation = (
            <>
              <animateMotion
                path={edgePath}
                dur={`${particleDurations[i]}s`}
                repeatCount="indefinite"
                begin={`${(i * 2) / particleCount}s`}
              />
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                dur="0.3s"
                begin={`${(i * 2) / particleCount}s`}
                fill="freeze"
              />
            </>
          );

          switch (shape) {
            case 'square':
              return (
                <rect key={i} {...commonProps} width="8" height="8" x="-4" y="-4">
                  {animation}
                </rect>
              );
            case 'triangle':
              return (
                <polygon key={i} {...commonProps} points="0,-5 4.33,2.5 -4.33,2.5">
                  {animation}
                </polygon>
              );
            case 'circle':
            default:
              return (
                <circle key={i} {...commonProps} r="4">
                  {animation}
                </circle>
              );
          }
        })}
    </>
  );
};
