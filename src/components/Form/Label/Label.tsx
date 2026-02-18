import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@/utils';

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  component?: 'label' | 'span';
}

export const Label: React.FC<LabelProps> = ({ className, component = 'label', ...props }) => {
  const clsasses = cn(
    'flex items-center gap-2 text-xs leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    className,
  );

  return component === 'label' ? (
    <LabelPrimitive.Root className={clsasses} {...props} />
  ) : (
    <span className={clsasses} {...props} />
  );
};
