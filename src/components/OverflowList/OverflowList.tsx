import { useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/utils/mergeClass';
import { Tooltip } from '@socprime/react-ui';
import { getVisibleCount } from './getVisibleCount';

type TooltipProps = React.ComponentProps<typeof Tooltip>;

export interface OverflowListProps<T> {
  items: T[];
  separator?: React.ReactNode;
  maxVisible?: number;
  className?: string;
  itemClassName?: string;
  overflowClassName?: string;
  tooltipClassName?: string;
  tooltipProps?: Omit<TooltipProps, 'content' | 'children'>;
  getKey?: (item: T, index: number) => string | number;
  renderItem?: (item: T, index: number) => React.ReactNode;
  renderOverflowItem?: (item: T, index: number) => React.ReactNode;
  renderOverflowContent?: (hiddenItems: T[]) => React.ReactNode;
  renderOverflowTrigger?: (count: number) => React.ReactNode;
}

const defaultRenderItem = <T,>(item: T) => String(item);

export const OverflowList = <T,>({
  items,
  separator,
  maxVisible,
  className,
  itemClassName,
  overflowClassName,
  tooltipClassName,
  tooltipProps,
  getKey = (_, index) => index,
  renderItem = defaultRenderItem,
  renderOverflowItem,
  renderOverflowContent,
  renderOverflowTrigger = (count) => `+${count}`,
}: OverflowListProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;

    if (!container || !measure) {
      return undefined;
    }

    const recalculate = () => {
      const containerWidth = container.getBoundingClientRect().width;

      if (containerWidth <= 0) {
        return;
      }

      const children = Array.from(measure.children) as HTMLElement[];
      const overflowElement = children.at(-1);
      const itemElements = children.slice(0, -1);
      const itemWidths = itemElements.map((element) => element.getBoundingClientRect().width);

      if (itemElements.length > 0 && itemWidths.every((width) => width <= 0)) {
        return;
      }

      const gap = Number.parseFloat(getComputedStyle(measure).columnGap) || 0;

      setVisibleCount(
        getVisibleCount({
          itemWidths,
          overflowWidth: overflowElement?.getBoundingClientRect().width ?? 0,
          containerWidth,
          gap,
          maxVisible,
        }),
      );
    };

    recalculate();

    const observer = new ResizeObserver(recalculate);
    observer.observe(container);

    return () => observer.disconnect();
  }, [items, maxVisible, separator]);

  if (items.length === 0) {
    return null;
  }

  const safeVisibleCount = Math.min(visibleCount, items.length);
  const visibleItems = items.slice(0, safeVisibleCount);
  const hiddenItems = items.slice(safeVisibleCount);
  const rowClassName = cn('flex min-w-0 items-center gap-1', className);

  const overflowContent =
    renderOverflowContent?.(hiddenItems) ??
    (hiddenItems.length > 0 ? (
      <ul className="flex flex-col gap-1">
        {hiddenItems.map((item, index) => (
          <li key={getKey(item, safeVisibleCount + index)}>
            {(renderOverflowItem ?? renderItem)(item, safeVisibleCount + index)}
          </li>
        ))}
      </ul>
    ) : null);

  const renderMeasuredItem = (item: T, index: number) => (
    <span
      key={getKey(item, index)}
      className={cn('inline-flex shrink-0 items-center whitespace-nowrap', itemClassName)}
    >
      {index > 0 && separator}
      {renderItem(item, index)}
    </span>
  );

  return (
    <div ref={containerRef} className="relative w-full min-w-0 overflow-hidden">
      <div
        ref={measureRef}
        aria-hidden
        className={cn(
          'pointer-events-none invisible absolute top-0 left-0 flex items-center gap-1',
          className,
        )}
        style={{ width: 'max-content' }}
      >
        {items.map(renderMeasuredItem)}
        <span className={cn('inline-flex shrink-0 whitespace-nowrap', overflowClassName)}>
          {renderOverflowTrigger(items.length)}
        </span>
      </div>

      <div className={cn(rowClassName, 'w-full overflow-hidden')}>
        <div>{visibleItems.map(renderMeasuredItem)}</div>
        {hiddenItems.length > 0 && (
          <Tooltip
            content={overflowContent}
            className={cn('max-w-[350px]', tooltipClassName)}
            {...tooltipProps}
          >
            <span
              className={cn(
                'inline-flex shrink-0 cursor-default whitespace-nowrap',
                overflowClassName,
              )}
            >
              {renderOverflowTrigger(hiddenItems.length)}
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
