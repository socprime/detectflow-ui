import { cn } from '@/utils';
import { LoaderIcon } from 'lucide-react';

interface SpinnerProps extends React.ComponentProps<'svg'> {
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 4, ...props }) => {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn(`size-${size} animate-spin`, className)}
      {...props}
    />
  );
};

export const SpinnerCustom: React.FC<SpinnerProps> = ({ className, size = 4, ...props }) => {
  return (
    <div className="flex h-full w-full items-center justify-center gap-4">
      <Spinner className={className} size={size} {...props} />
    </div>
  );
};
