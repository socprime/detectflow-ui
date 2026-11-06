import { animate, useMotionValue, useMotionValueEvent } from 'motion/react';
import { useEffect, useRef } from 'react';

export type ParticleShape = 'circle' | 'square' | 'triangle';

interface PathParticleProps {
  pathRef: React.RefObject<SVGPathElement | null>;
  edgePath: string;
  color: string;
  shape: ParticleShape;
  duration: number;
  delay: number;
}

export const PathParticle = ({
  pathRef,
  edgePath,
  color,
  shape,
  duration,
  delay,
}: PathParticleProps) => {
  const elementRef = useRef<SVGElement>(null);
  const progress = useMotionValue(0);
  const opacity = useMotionValue(0);
  const lengthRef = useRef(0);

  useEffect(() => {
    lengthRef.current = pathRef.current?.getTotalLength() ?? 0;
  }, [pathRef, edgePath]);

  useEffect(() => {
    progress.set(0);
    opacity.set(0);
    const motionControls = animate(progress, [0, 1], {
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
    });
    const fadeControls = animate(opacity, 1, {
      duration: 0.2,
      delay,
      ease: 'easeOut',
    });

    return () => {
      motionControls.stop();
      fadeControls.stop();
    };
  }, [delay, duration, progress, opacity]);

  useMotionValueEvent(opacity, 'change', (value) => {
    elementRef.current?.setAttribute('opacity', String(value));
  });

  useMotionValueEvent(progress, 'change', (value) => {
    const path = pathRef.current;
    const element = elementRef.current;
    if (!path || !element) {
      return;
    }

    const length = lengthRef.current;
    if (length <= 0) {
      return;
    }

    const point = path.getPointAtLength(value * length);

    if (shape === 'circle') {
      element.setAttribute('cx', String(point.x));
      element.setAttribute('cy', String(point.y));
      return;
    }

    if (shape === 'square') {
      element.setAttribute('x', String(point.x - 4));
      element.setAttribute('y', String(point.y - 4));
      return;
    }

    element.setAttribute('transform', `translate(${point.x}, ${point.y})`);
  });

  if (shape === 'square') {
    return (
      <rect
        ref={elementRef as React.RefObject<SVGRectElement>}
        width={8}
        height={8}
        fill={color}
        opacity={0}
      />
    );
  }

  if (shape === 'triangle') {
    return (
      <g ref={elementRef as React.RefObject<SVGGElement>} opacity={0}>
        <polygon points="0,-5 4.33,2.5 -4.33,2.5" fill={color} />
      </g>
    );
  }

  return (
    <circle ref={elementRef as React.RefObject<SVGCircleElement>} r={4} fill={color} opacity={0} />
  );
};
