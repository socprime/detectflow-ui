import { EmptyState } from '@/components/EmptyState';
import { routes } from '@/models/router/routes';
import { Server } from 'lucide-react';

export const LogSourcesEmptyState: React.FC = () => {
  return (
    <EmptyState
      Icon={Server}
      title="No Custom Log Sources Yet"
      description="Create your first custom log source with mapping configuration to extend available log sources."
      path={routes.settingsLogSourcesCreate}
      action="Create Log Source"
    />
  );
};
