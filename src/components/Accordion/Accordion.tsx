import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils';

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;
type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item>;
type AccordionTriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  chevronPosition?: 'right' | 'left';
  chevronClassName?: string;
};
type AccordionContentProps = React.ComponentProps<typeof AccordionPrimitive.Content>;

export const Accordion: React.FC<AccordionProps> = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Root data-slot="accordion" {...props}>
      {children}
    </AccordionPrimitive.Root>
  );
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ className, children, ...props }) => {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-border border-b last:border-b-0', className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  );
};

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  className,
  children,
  chevronPosition,
  chevronClassName,
  ...props
}) => {
  const chevronPositionClass = chevronPosition === 'left' ? 'flex-row-reverse' : '';
  const hasParentSelectors = chevronClassName?.includes('[&[') || chevronClassName?.includes('[&_');
  const triggerChevronClass = hasParentSelectors ? chevronClassName : '';
  const iconClass = hasParentSelectors ? '' : chevronClassName;
  const defaultRotateClass = chevronClassName ? '' : '[&[data-state=open]>svg]:rotate-180';

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'flex flex-1 items-start justify-between gap-2 px-2 py-4 text-left text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50',
          defaultRotateClass,
          triggerChevronClass,
          chevronPositionClass,
          className,
        )}
        {...props}
      >
        {children}
        {chevronPosition && (
          <ChevronDownIcon
            className={cn(
              'text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200',
              iconClass,
            )}
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

export const AccordionContent: React.FC<AccordionContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-xs"
      {...props}
    >
      <div className={cn('pt-0 pb-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
};
