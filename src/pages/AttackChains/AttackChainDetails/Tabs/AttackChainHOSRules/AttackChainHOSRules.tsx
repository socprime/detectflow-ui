import { RuleDetailsContent } from '@/components/RuleDetails';
import { useAttackChainsStore } from '@/store';
import { PageHeader } from '@socprime/react-ui';

import SigmaLineIcon from '@/assets/svg/sigma-line.svg?react';

export const AttackChainHOSRules = () => {
  const loading = useAttackChainsStore((state) => state.loading);
  const detail = useAttackChainsStore((state) => state.detail);

  const type = detail?.chain_type === 'HOS' ? 'Higher Order Sigma Rule' : 'Open Tied';

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        className="from-red-violet/30 flex-nowrap bg-gradient-to-b to-transparent p-6"
        loading={loading}
        titleIcon={<SigmaLineIcon className="text-red-violet size-6" />}
        title={detail?.hos_rule?.name}
        description={type}
      />
      <div className="p-6 pt-0">
        <RuleDetailsContent loading={loading} data={detail?.hos_rule} />
      </div>
    </div>
  );
};
