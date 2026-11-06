import { Activity } from 'lucide-react';

import { EmptyState } from '@socprime/react-ui';

export const DashboardEmptyState: React.FC = () => {
  return (
    <EmptyState
      Icon={Activity}
      title="No Active Pipelines"
      description="Configure and activate at least one pipeline to see the data flow visualization on this dashboard."
    />
  );
};
