import { Tooltip } from '@/components/Tooltip/Tooltip';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

export interface InputProps extends React.ComponentProps<'input'> {
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  tooltip?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  className,
  type,
  loading,
  iconLeft,
  iconRight,
  tooltip,
  ...props
}) => {
  const element = (
    <div className="relative">
      {iconLeft && <div className="absolute top-1/2 left-3 -translate-y-1/2">{iconLeft}</div>}
      <input
        type={type}
        data-slot="input"
        className={cn(
          'text-default placeholder:text-gray-chateau border-border flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-xs transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:ring-success/40 focus-visible:border-success focus-visible:ring-[2px]',
          iconLeft && 'pl-9',
          iconRight && 'pr-9',
          className,
        )}
        autoComplete="off"
        {...props}
      />
      {iconRight && <div className="absolute top-1/2 right-3 -translate-y-1/2">{iconRight}</div>}
      {loading && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <Loader2 className="text-gray-chateau size-4 animate-spin" />
        </div>
      )}
    </div>
  );
  return tooltip ? <Tooltip content={tooltip}>{element}</Tooltip> : element;
};
