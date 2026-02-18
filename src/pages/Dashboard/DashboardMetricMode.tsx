import { Tooltip } from '@/components/Tooltip';
import { useDashboardStore } from '@/store/dashboard';
import React from 'react';

export const DashboardMetricMode: React.FC = () => {
  const hasDashboardData = useDashboardStore((state) => state.dashboardData !== null);
  const metricMode = useDashboardStore((state) => state.metricMode);
  const setMetricMode = useDashboardStore((state) => state.setMetricMode);

  if (!hasDashboardData) {
    return null;
  }

  return (
    <Tooltip content="Coming soon">
      <div className="border-border bg-secondary flex items-center gap-1 rounded-lg border p-1 opacity-70">
        <button
          onClick={() => setMetricMode?.('events')}
          className={`relative rounded-md px-4 py-2 text-sm transition-all ${
            metricMode === 'events'
              ? 'text-default bg-hover shadow-sm'
              : 'text-text-subdued hover:text-text-subdued'
          }`}
          disabled
        >
          Events/sec
        </button>
        <button
          onClick={() => setMetricMode?.('tagged')}
          className={`relative rounded-md px-4 py-2 text-sm transition-all ${
            metricMode === 'tagged'
              ? 'text-default bg-hover shadow-sm'
              : 'text-text-subdued hover:text-text-subdued'
          }`}
          disabled
        >
          Gb/sec
        </button>
      </div>
    </Tooltip>
  );
};
