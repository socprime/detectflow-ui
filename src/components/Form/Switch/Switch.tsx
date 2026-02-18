import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';

import { Tooltip } from '@/components/Tooltip/Tooltip';
import { cn } from '@/utils';

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  thumbClassName?: string;
  tooltip?: React.ReactNode;
}

export const Switch: React.FC<SwitchProps> = ({
  className,
  thumbClassName,
  tooltip,
  ...props
}: SwitchProps) => {
  const element = (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-success data-[state=unchecked]:bg-comet focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 disabled:bg-gray-chateau inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-20',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-primary data-[state=unchecked]:bg-primary data-[state=checked]:bg-primary pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
          thumbClassName,
        )}
      />
    </SwitchPrimitive.Root>
  );

  return tooltip ? <Tooltip content={tooltip}>{element}</Tooltip> : element;
};
