import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/utils';

interface TooltipProviderProps extends React.ComponentProps<typeof TooltipPrimitive.Provider> {
  delayDuration?: number;
}

interface TooltipParentProps extends React.ComponentProps<typeof TooltipPrimitive.Root> {}

interface TooltipTriggerProps extends React.ComponentProps<typeof TooltipPrimitive.Trigger> {}

interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({
  delayDuration = 0,
  ...props
}) => {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
};

export const TooltipParent: React.FC<TooltipParentProps> = ({ ...props }) => {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
};

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ ...props }) => {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
};

export const TooltipContent: React.FC<TooltipContentProps> = ({
  className,
  sideOffset = 0,
  children,
  ...props
}) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 text-default text-2xs bg-tooltip-white text-tooltip-black z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 shadow-md',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-tooltip-white fill-tooltip-white z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};
