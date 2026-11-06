import { useMemo } from 'react';
import { ATTACK_CHAINS_TABS } from './constants';
import { AttackChainsTab } from './Tabs/AttackChainsTab';
import { MonitoredThreatsTab } from './Tabs/MonitoredThreatsTab';
import { useAttackChain } from './useAttackChain';

import { PageHeader, Tabs } from '@socprime/react-ui';

export const AttackChains = () => {
  const { activeTab, handleTabChange } = useAttackChain();
  const tabs = useMemo(
    () => [
      {
        value: ATTACK_CHAINS_TABS.attackChains,
        label: 'Attack Chains',
        Content: AttackChainsTab,
      },
      {
        value: ATTACK_CHAINS_TABS.monitoredThreats,
        label: 'Monitored Threats',
        Content: MonitoredThreatsTab,
      },
    ],
    [],
  );

  return (
    <div className="relative flex w-full flex-col gap-6 p-6">
      <PageHeader
        title="Attack Chains"
        description="Use tagged events for threat inference to get actionable insights from correlating detected MITRE ATT&CK techniques."
      />
      <Tabs
        tabs={tabs}
        value={activeTab}
        onValueChange={handleTabChange}
        className="gap-0"
        tabsContentClassName="mt-0 border-t border-border pt-4"
        tabsListClassName="bg-transparent"
        tabClassName="hover:bg-transparent"
      />
    </div>
  );
};
