import { Outlet } from 'react-router-dom';
import { useAttackChainDetails, useTabs } from './hooks';
import { StatusSelect } from './StatusSelect';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions, useReturnLink } from '@/hooks';
import { routes } from '@/models/router';
import {
  Aside,
  AsideHorizontal,
  ConditionalContent,
  PageHeader,
  Skeleton,
} from '@socprime/react-ui';
import { Severity } from '@socprime/react-ui/domain';

export const AttackChainDetails = () => {
  const { tabs, activeTabId } = useTabs();
  const { data, loading, loadingStatus, handleUpdateStatus } = useAttackChainDetails();
  const { isViewer } = usePermissions();
  const backLink = useReturnLink({ fallback: routes.attackChains });

  return (
    <div className="relative flex w-full flex-col">
      <PageHeader
        className="border-border border-b px-4 py-3 sm:px-6"
        titleClassName="break-words"
        loading={loading}
        backLink={backLink}
        titleIcon={
          data?.severity ? <Severity arrowClassName="size-5" severity={data?.severity} /> : null
        }
        title={data?.name}
        description={
          <span className="text-2xs flex items-center gap-1">
            Attack Chain:
            <ConditionalContent
              loading={loading}
              loadingContent={<Skeleton className="h-3 w-20" />}
              loadedContent={<span className="text-default">{data?.chain_type}</span>}
            />
          </span>
        }
      >
        <DisabledTooltip disabled={isViewer}>
          <StatusSelect
            loading={loading || loadingStatus}
            status={data?.status || ''}
            disabled={isViewer}
            onChange={handleUpdateStatus}
          />
        </DisabledTooltip>
      </PageHeader>
      <div className="flex h-full min-w-0 flex-1 flex-col lg:flex-row">
        <AsideHorizontal
          className="border-border bg-primary sticky top-0 z-10 border-b px-4 py-3 lg:hidden"
          tabs={tabs}
        />
        <div className="border-border hidden max-w-68 min-w-68 flex-1 border-r px-3 py-6 pl-6 lg:block">
          <Aside className="sticky top-4" tabs={tabs} activeId={activeTabId} />
        </div>
        <div className="min-w-0 flex-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
