import { Layers3Icon } from 'lucide-react';

import { cn } from '@/utils/mergeClass';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@socprime/react-ui';

interface GroupByProps {
  className?: string;
  loading: boolean;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export const GroupBy = ({ className, loading, value, options, onChange }: GroupByProps) => {
  return (
    <Select value={value} disabled={loading} onValueChange={onChange}>
      <SelectTrigger loading={loading} className={cn('h-10', className)}>
        <div className="flex items-center gap-2">
          <Layers3Icon className="size-4" />
          <SelectValue placeholder="Group by" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
