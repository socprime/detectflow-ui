import { Tabs } from '@socprime/react-ui';
import { useMemo } from 'react';
import { ChainingTab } from './ChainingTab';
import { PIPELINES_TABS } from './constants';
import { MatchingTab } from './MatchingTab';
import { usePipelinesTabs } from './usePipelinesTabs';

export const PipelinesTabs = () => {
  const { activeTab, handleTabChange } = usePipelinesTabs();
  const pipelinesTabs = useMemo(
    () => [
      {
        value: PIPELINES_TABS.matching,
        label: 'Matching',
        Content: MatchingTab,
      },
      {
        value: PIPELINES_TABS.chaining,
        label: 'Chaining',
        Content: ChainingTab,
      },
    ],
    [],
  );

  return (
    <Tabs
      tabs={pipelinesTabs}
      value={activeTab}
      onValueChange={handleTabChange}
      className="gap-0"
      tabsContentClassName="mt-0 border-t border-border pt-4"
      tabsListClassName="bg-transparent"
      tabClassName="hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
    />
  );
};
