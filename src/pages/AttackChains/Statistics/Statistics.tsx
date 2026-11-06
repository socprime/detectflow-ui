import { useStatistics } from './useStatistics';

import { ConditionalContent, Skeleton } from '@socprime/react-ui';
import { StatisticCard } from '@socprime/react-ui/charts';

const COLORS: Record<string, string> = {
  'attack chains': '#ef4444',
  'monitored threats': '#ef4444',
  'affected hostnames': '#fb923c',
  'monitored vectors': '#a78bfa',
  'tagged events': '#3b82f6',
  'matched rules': '#3b82f6',
};

export const Statistics = () => {
  const { loading, length, graphData } = useStatistics();

  return (
    <div className="flex flex-wrap gap-4">
      <ConditionalContent
        loading={loading}
        loadingContent={Array.from({ length }, (_, index) => (
          <div className="flex-1" key={index}>
            <Skeleton className="min-h-[144px] w-full" />
          </div>
        ))}
        loadedContent={graphData?.map((block) => (
          <StatisticCard
            title={block.name}
            data={{
              name: block.name,
              activeCount: block.count_active,
              totalCount: block.count_all,
              points: block.points,
            }}
            color={COLORS[block.name.toLowerCase()]}
            key={block.name}
          />
        ))}
      />
    </div>
  );
};
