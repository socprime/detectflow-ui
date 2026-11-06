import type { EdgeProps } from '@xyflow/react';
import { getBezierPath } from '@xyflow/react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ParticleShape, PathParticle } from './PathParticle';

import { useThemeColors } from '@/hooks/useThemeColors';

const PATH_DRAW_DURATION_MS = 1000;

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
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const pathRef = useRef<SVGPathElement>(null);
  const { success } = useThemeColors();
  const color = (data?.color as string) || success;
  const particleCount = (data?.particleCount as number) || 2;
  const shape = (data?.shape as ParticleShape) || 'circle';
  const delay = (data?.animationDelay as number) || 0;
  const shouldAnimateOnMount = data?.shouldAnimateOnMount !== false;
  const isDimmed = (data?.isDimmed as boolean) || false;
  const disableAnimation = (data?.disableAnimation as boolean) || false;
  const hasCompletedInitialAnimation = useRef(false);
  const [visible, setVisible] = useState(() => !shouldAnimateOnMount);
  const [particlesVisible, setParticlesVisible] = useState(false);
  const [particleSession, setParticleSession] = useState(0);

  useEffect(() => {
    if (visible || hasCompletedInitialAnimation.current) {
      return;
    }

    if (shouldAnimateOnMount) {
      const t = setTimeout(() => {
        setVisible(true);
      }, delay);
      return () => clearTimeout(t);
    }

    setVisible(true);
  }, [delay, shouldAnimateOnMount, visible]);

  useEffect(() => {
    if (!visible) {
      setParticlesVisible(false);
      return;
    }

    const pathDrawDurationMs = hasCompletedInitialAnimation.current ? 200 : PATH_DRAW_DURATION_MS;
    const t = setTimeout(() => {
      setParticleSession((session) => session + 1);
      setParticlesVisible(true);

      if (!hasCompletedInitialAnimation.current) {
        hasCompletedInitialAnimation.current = true;
      }
    }, pathDrawDurationMs);

    return () => clearTimeout(t);
  }, [visible]);

  const particleDurations = useMemo(
    () => Array.from({ length: particleCount }, () => 2 + Math.random() * 1.5),
    [id, particleCount, particleSession],
  );

  const showParticles = particlesVisible && visible && !isDimmed && !disableAnimation;

  return (
    <>
      <motion.path
        ref={pathRef}
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
      {showParticles &&
        Array.from({ length: particleCount }, (_, i) => {
          const staggerDelay = (i * 2) / particleCount;

          return (
            <PathParticle
              key={`${id}-${particleSession}-particle-${i}`}
              pathRef={pathRef}
              edgePath={edgePath}
              color={color}
              shape={shape}
              duration={particleDurations[i]}
              delay={staggerDelay}
            />
          );
        })}
    </>
  );
};
