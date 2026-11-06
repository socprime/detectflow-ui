import { ServerIcon } from 'lucide-react';
import { Filters } from '../Filters';
import { IntegrationCard } from './IntegrationCard';
import { useAvailableTab } from './useAvailableTab';

import { ConditionalContent, EmptyState, Skeleton } from '@socprime/react-ui';

export const AvailableTab = () => {
  const { data, loading } = useAvailableTab();

  return (
    <div className="flex flex-col gap-6">
      <Filters />
      <ConditionalContent
        loading={loading}
        loadingContent={
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton className="h-65 w-full" key={index} />
            ))}
          </div>
        }
        loadedContent={
          data && data.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {data.map((item) => (
                <IntegrationCard key={item.integration_type} data={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              Icon={ServerIcon}
              title="No Available Integrations"
              description="No integrations found for the selected category"
            />
          )
        }
      />
    </div>
  );
};
