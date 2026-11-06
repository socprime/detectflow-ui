import { PageHeader } from '@socprime/react-ui';
import { useRuleHOS } from './useRuleHOS';

import { RuleDetailsContent } from '@/components/RuleDetails';

import SigmaLineIcon from '@/assets/svg/sigma-line.svg?react';

export const RuleHOS: React.FC = () => {
  const { loading, rule, backLink } = useRuleHOS();

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        className="from-red-violet/30 flex-nowrap bg-gradient-to-b to-transparent p-6"
        loading={loading}
        titleIcon={<SigmaLineIcon className="text-red-violet size-6" />}
        title={rule?.name}
        description={rule?.repository_name}
        backLink={backLink}
      />
      <div className="p-6 pt-0">
        <RuleDetailsContent loading={loading} data={rule} />
      </div>
    </div>
  );
};
