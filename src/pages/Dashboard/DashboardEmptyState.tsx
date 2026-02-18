import { EmptyState } from '@/components/EmptyState';
import { routes } from '@/models/router/routes';
import { Activity } from 'lucide-react';

export const DashboardEmptyState: React.FC = () => {
  return (
    <EmptyState
      Icon={Activity}
      title="No Active Pipelines"
      description="Configure and activate at least one pipeline to see the data flow visualization on this dashboard."
      path={routes.pipelines}
      action="Configure Pipeline"
    />
  );
};
