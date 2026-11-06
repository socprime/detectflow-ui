import { LayersIcon, SparklesIcon, WorkflowIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useViewInSiem } from '../../hooks/useViewInSiem';
import { AISummary } from './AISummary';
import { SideBar } from './SideBar';
import { Techniques } from './Techniques';
import { ThreatMetadata } from './ThreatMetadata';

import { useReturnTo } from '@/hooks/useReturnTo';
import { useAttackChainsStore } from '@/store';
import { ConditionalContent, Skeleton } from '@socprime/react-ui';
import { AttackTimeline, mapChainGraphBranches } from '@socprime/react-ui/domain';
import { ActiveThreatLink } from './ActiveThreatLink/ActiveThreatLink';

export const AttackChainGeneral = () => {
  const loading = useAttackChainsStore((state) => state.loading);
  const data = useAttackChainsStore((state) => state.detail);
  const returnTo = useReturnTo();
  const viewInSiem = useViewInSiem(data?.id);
  const chainGraph = data?.chain_graph || [];
  const chainGraphBranches = useMemo(
    () => mapChainGraphBranches(data?.chain_alternatives, chainGraph),
    [data?.chain_alternatives, chainGraph],
  );

  return (
    <div className="flex flex-col gap-12 p-6">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <ThreatMetadata
            loading={loading}
            severity={data?.severity}
            hostname={data?.hostname}
            username={data?.username}
            eventCount={data?.event_count}
            ruleCount={data?.rule_count}
          />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <SparklesIcon className="text-success size-4" />
              <h3 className="text-default text-2xs uppercase">AI Summary</h3>
            </div>
            <ConditionalContent
              loading={loading}
              loadingContent={<Skeleton className="h-4 w-full" rows={4} />}
              loadedContent={<AISummary aiSummary={data?.ai_summary?.split('\n') || []} />}
            />
          </div>
          <ConditionalContent
            loading={loading}
            loadingContent={<Skeleton className="h-15 w-full" />}
            loadedContent={<ActiveThreatLink data={data?.active_threat} />}
          />
        </div>
        <div className="w-full max-w-[320px] flex-1">
          <SideBar data={data ?? undefined} loading={loading} viewInSiem={viewInSiem} />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <LayersIcon className="text-success size-4" />
            <h3 className="text-default text-2xs uppercase">Chain</h3>
          </div>
          <ConditionalContent
            loading={loading}
            loadingContent={<Skeleton className="h-35 w-full" />}
            loadedContent={<AttackTimeline steps={chainGraph} branches={chainGraphBranches} />}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <WorkflowIcon className="text-success size-4" />
            <h3 className="text-default text-2xs uppercase">Techniques</h3>
          </div>
          <ConditionalContent
            loading={loading}
            loadingContent={<Skeleton className="h-15 w-full" rows={4} />}
            loadedContent={
              <Techniques
                attackChainId={data?.id ?? ''}
                returnTo={returnTo}
                techniques={data?.techniques ?? []}
                viewInSiem={viewInSiem}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
