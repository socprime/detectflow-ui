import { useActiveThreatsStore } from '@/store';
import { useParams } from 'react-router-dom';
import { DetectionsTable } from './DetectionsTable';
import { SigmaRuleTable } from './SigmaRuleTable';

export const ActiveThreatDetections = () => {
  const loading = useActiveThreatsStore((state) => state.loading);
  const data = useActiveThreatsStore((state) => state.detail);
  const { activeThreatId } = useParams<{ activeThreatId: string }>();

  return (
    <div className="flex flex-col gap-6 p-6 2xl:max-w-[75%]">
      <SigmaRuleTable
        data={data?.high_order_sigmas ?? []}
        loading={loading}
        activeThreatId={activeThreatId ?? undefined}
      />
      <DetectionsTable
        loading={loading}
        data={data?.rules ?? []}
        ruleCheckResults={data?.rule_check_results}
        activeThreatId={activeThreatId ?? undefined}
      />
    </div>
  );
};
