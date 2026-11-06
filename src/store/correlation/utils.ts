import type {
  CorrelationJobGraphData,
  CorrelationJobGraphDataPoint,
} from '@/models/providers/Types/responses/correlation';

const arePointsEqual = (
  a: CorrelationJobGraphDataPoint[],
  b: CorrelationJobGraphDataPoint[],
): boolean =>
  a.length === b.length &&
  a.every((point, index) => point.name === b[index].name && point.value === b[index].value);

const areBlocksEqual = (a: CorrelationJobGraphData[], b: CorrelationJobGraphData[]): boolean =>
  a.length === b.length &&
  a.every((block, index) => {
    const other = b[index];
    return (
      block.name === other.name &&
      block.count_active === other.count_active &&
      block.count_all === other.count_all &&
      arePointsEqual(block.points, other.points)
    );
  });

export const parseGraphBlocks = (data: unknown): CorrelationJobGraphData[] | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const { blocks } = data as { blocks?: unknown };
  return Array.isArray(blocks) ? (blocks as CorrelationJobGraphData[]) : null;
};

export const mergeGraphData = (
  next: CorrelationJobGraphData[],
  previous: CorrelationJobGraphData[] | null,
): CorrelationJobGraphData[] => (previous && areBlocksEqual(next, previous) ? previous : next);
