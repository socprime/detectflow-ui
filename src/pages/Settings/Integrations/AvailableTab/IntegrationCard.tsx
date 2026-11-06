import { FC } from 'react';
import { INTEGRATION_CATEGORY } from '../constants';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks';
import type { IntegrationTypeCatalogItem } from '@/models/providers/Types/responses/integrations';
import { routeHelpers } from '@/models/router';
import { getCategoryName, getPlatformIcon } from '@/utils/platforms';
import { Badge, Button } from '@socprime/react-ui';

interface IntegrationCardProps {
  data: IntegrationTypeCatalogItem;
}

export const IntegrationCard: FC<IntegrationCardProps> = ({ data }) => {
  const { icon, display_name, category, description, connected_count, integration_type } = data;
  const Icon = getPlatformIcon(icon);
  const { isViewer } = usePermissions();

  return (
    <div className="border-border bg-secondary hover:border-success flex flex-col gap-6 rounded-lg border p-6 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        <Icon className="text-gray-chateau size-7" />
        <Badge
          className="bg-hover hover:bg-hover text-gray-chateau rounded-full"
          variant="defaultOutline"
        >
          {getCategoryName(category)}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <h3 className="text-default text-sm font-normal">{display_name}</h3>
        <p className="text-gray-chateau text-2xs">{description}</p>
      </div>
      <div className="flex items-center justify-between">
        <DisabledTooltip disabled={isViewer}>
          {category === INTEGRATION_CATEGORY.SOC_PRIME && connected_count > 0 ? (
            <Button variant="secondaryOutline" size="m" className="text-xs" disabled>
              Already Added
            </Button>
          ) : (
            <Button
              variant="secondaryOutline"
              size="s"
              className="text-xs"
              {...(isViewer
                ? { disabled: true }
                : { to: routeHelpers.settingsIntegrationsAdd(integration_type) })}
            >
              Add
            </Button>
          )}
        </DisabledTooltip>
      </div>
    </div>
  );
};
