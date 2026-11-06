import { Outlet } from 'react-router-dom';

import { ATTACK_CHAINS_TABS } from '../constants';
import { useTabs } from './hooks';
import { useActiveThreatDetails } from './hooks/useActiveThreatDetails';

import { useReturnLink } from '@/hooks';
import { routes } from '@/models/router';
import { buildUrl } from '@/utils';
import { Aside, AsideHorizontal, PageHeader } from '@socprime/react-ui';
import { Severity } from '@socprime/react-ui/domain';

export const ActiveThreatDetails = () => {
  const { loading, data } = useActiveThreatDetails();
  const { tabs, activeTabId } = useTabs();

  const backLink = useReturnLink({
    fallback: buildUrl(routes.attackChains, { tab: ATTACK_CHAINS_TABS.monitoredThreats }),
  });

  return (
    <div className="relative flex w-full flex-col">
      <PageHeader
        className="border-border border-b px-4 py-3 sm:px-6"
        titleClassName="break-words"
        loading={loading}
        backLink={backLink}
        titleIcon={
          data?.severity ? <Severity arrowClassName="size-4" severity={data?.severity} /> : null
        }
        title={data?.name}
        description={
          <span className="text-2xs">
            Monitored Threat: <span className="text-default">{data?.threat_types?.join(', ')}</span>
          </span>
        }
      />
      <div className="flex h-full min-w-0 flex-1 flex-col lg:flex-row">
        <AsideHorizontal
          className="border-border bg-primary sticky top-0 z-10 border-b px-4 py-3 lg:hidden"
          tabs={tabs}
        />
        <div className="border-border hidden max-w-68 min-w-[260px] flex-1 border-r px-3 py-6 pl-6 lg:block">
          <Aside className="sticky top-4 [&_span]:w-full" tabs={tabs} activeId={activeTabId} />
        </div>
        <div className="min-w-0 flex-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
