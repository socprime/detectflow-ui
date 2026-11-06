import { XIcon } from 'lucide-react';

import { Button } from '@socprime/react-ui';

import SigmaLineIcon from '@/assets/svg/sigma-line.svg?react';

interface RuleDetailsHeaderProps {
  name?: string;
  type: string;
  backLink?: string;
}

export const RuleDetailsHeader: React.FC<RuleDetailsHeaderProps> = ({ name, type, backLink }) => {
  return (
    <div className="from-red-violet/30 flex items-center justify-between gap-6 bg-gradient-to-b to-transparent px-6 py-5">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6">
          <SigmaLineIcon className="text-red-violet size-6" />
          <div className="flex flex-col gap-2">
            <h3 className="text-default text-sm font-semibold uppercase">{name}</h3>
            <span className="text-gray-chateau text-xs">{type}</span>
          </div>
        </div>
      </div>
      {backLink && (
        <div className="flex items-center gap-2">
          <Button variant="icon" size="xs" className="text-2xs" to={backLink}>
            <XIcon className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
