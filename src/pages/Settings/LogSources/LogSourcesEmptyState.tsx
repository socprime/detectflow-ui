import { ServerIcon } from 'lucide-react';

import { routes } from '@/models/router/routes';
import { EmptyState } from '@socprime/react-ui';

export const LogSourcesEmptyState: React.FC = () => {
  return (
    <EmptyState
      Icon={ServerIcon}
      title="No Custom Log Sources Yet"
      description="Create your first custom log source with mapping configuration to extend available log sources."
      path={routes.settingsLogSourcesCreate}
      action="Create Log Source"
    />
  );
};
