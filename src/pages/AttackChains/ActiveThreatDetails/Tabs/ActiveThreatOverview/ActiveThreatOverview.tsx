import { ActiveThreatDescription } from '@/pages/AttackChains/ActiveThreatDetails/Tabs/ActiveThreatOverview/ActiveThreatDescription';
import { useActiveThreatsStore } from '@/store';
import { CorrelationPipelines } from './CorrelationPipelines';
import { SideBar } from './SideBar';

export const ActiveThreatOverview = () => {
  const loading = useActiveThreatsStore((state) => state.loading);
  const data = useActiveThreatsStore((state) => state.detail);

  return (
    <div className="flex flex-col gap-6 p-6 lg:flex-row lg:gap-6">
      <div className="flex flex-col gap-6 lg:flex-3">
        <ActiveThreatDescription
          loading={loading}
          summary={data?.summary ?? ''}
          investigation={data?.investigation ?? ''}
          mitigation={data?.mitigation ?? ''}
          response={data?.response ?? ''}
        />
        <CorrelationPipelines />
      </div>
      <div className="flex-1">
        <SideBar loading={loading} data={data ?? undefined} />
      </div>
    </div>
  );
};
