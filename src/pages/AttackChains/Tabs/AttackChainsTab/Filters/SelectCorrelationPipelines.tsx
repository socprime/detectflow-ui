import { getStatusTextColor } from '@/utils';
import { FolderTreeIcon } from 'lucide-react';
import { PipelineSelectOption } from '../useAttackChainsTab';

import { EChainStatus } from '@/enums';
import { cn } from '@/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@socprime/react-ui';

interface SelectCorrelationPipelinesProps {
  className?: string;
  loading: boolean;
  value: string;
  options: PipelineSelectOption[];
  onChange: (value: string) => void;
}

export const SelectCorrelationPipelines = ({
  className,
  loading,
  value,
  options,
  onChange,
}: SelectCorrelationPipelinesProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger loading={loading} disabled={loading} className={cn('h-10', className)}>
        <div className="flex items-center gap-2">
          <FolderTreeIcon className="size-4" />
          <SelectValue placeholder="All Correlation Pipelines" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((c) => {
          const statusColor = getStatusTextColor(c.status as EChainStatus);

          return (
            <SelectItem key={c.value} value={c.value}>
              <span className="flex flex-col">
                {c.label}
                {c.status && (
                  <span
                    className={cn(
                      'text-3xs flex items-center gap-1 font-normal capitalize',
                      statusColor,
                    )}
                  >
                    <span className="block h-2 w-2 rounded-full bg-current" />
                    {c.status}
                  </span>
                )}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
