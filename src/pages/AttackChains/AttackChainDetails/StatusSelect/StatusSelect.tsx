import { getStatusColor, getStatusTextColor, getStatusTriggerClassName } from '@/utils';
import { FC, useMemo } from 'react';

import { EChainStatus } from '@/enums';
import { cn } from '@/utils';
import { Badge, Label, SelectDefault } from '@socprime/react-ui';

const statusOptions = [
  { label: 'New', value: EChainStatus.New },
  { label: 'Investigating', value: EChainStatus.Investigating },
  { label: 'Confirmed', value: EChainStatus.Confirmed },
  { label: 'False Positive', value: EChainStatus.FalsePositive },
  { label: 'Resolved', value: EChainStatus.Resolved },
  { label: 'Closed', value: EChainStatus.Closed },
  { label: 'Filtered Out', value: EChainStatus.FilteredOut },
];

interface StatusSelectProps {
  loading?: boolean;
  status: string;
  disabled?: boolean;
  onChange: (status: string) => void;
}

export const StatusSelect: FC<StatusSelectProps> = ({ loading, status, disabled, onChange }) => {
  const triggerClassName = useMemo(
    () => cn('min-w-40', getStatusTriggerClassName(status as EChainStatus)),
    [status],
  );

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-2xs text-subdued uppercase">Status</Label>
      <SelectDefault
        className={cn('focus-visible:ring-transparent', triggerClassName)}
        options={statusOptions}
        placeholder="Select status"
        value={status}
        loading={loading}
        disabled={loading || disabled}
        onChange={onChange}
        renderTriggerLabel={(value) => {
          const label = statusOptions.find((o) => o.value === value)?.label ?? value;
          return <span className="text-xs font-medium">{label}</span>;
        }}
        renderItemLabel={(value) => {
          const variant = getStatusColor(value as EChainStatus);
          const textColor = getStatusTextColor(value as EChainStatus);
          const label = statusOptions.find((o) => o.value === value)?.label ?? value;

          return (
            <Badge variant={variant} className="text-2xs rounded-md">
              <span className={textColor}>{label}</span>
            </Badge>
          );
        }}
      />
    </div>
  );
};
