import { useMemo, useState } from 'react';
import { AvailableTab } from './AvailableTab';
import { ConnectedTab } from './ConnectedTab';
import { useIntegrations } from './useIntegrations';

import { PageHeader, Tabs } from '@socprime/react-ui';

export const Integrations = () => {
  const { total } = useIntegrations();
  const [activeTab, setActiveTab] = useState('available');
  const tabs = useMemo(
    () => [
      { value: 'available', label: 'Available', content: <AvailableTab /> },
      {
        value: 'connected',
        label: total > 0 ? `Connected (${total})` : 'Connected',
        content: <ConnectedTab />,
      },
    ],
    [total],
  );

  return (
    <section className="flex w-full flex-col gap-6">
      <PageHeader
        title="Integrations"
        description="Connect external security platforms to orchestrate detection rules across all your environments"
      />
      <div className="flex flex-col gap-6">
        <Tabs
          tabsListClassName="rounded-none justify-start border-border border-b w-full"
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={tabs}
        />
      </div>
    </section>
  );
};
