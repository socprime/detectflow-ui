import { AttackFlow } from '@socprime/react-ui/attack-flow';
import { ConditionalContent, Skeleton } from '@socprime/react-ui';

import { useActiveThreatsStore } from '@/store';

export const ActiveThreatAttackFlow = () => {
  const loading = useActiveThreatsStore((state) => state.loading);
  const data = useActiveThreatsStore((state) => state.detail);

  return (
    <ConditionalContent
      loading={!!loading}
      loadingContent={<Skeleton className="h-40 w-full" />}
      loadedContent={<AttackFlow className="h-full w-full" content={data?.attack_flow || ''} />}
    />
  );
};
