import {
  Indicator as RadioGroupIndicatorPrimitive,
  Item as RadioGroupItemPrimitive,
  Root as RadioGroupPrimitive,
} from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils';

export interface SegmentedControlOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const segmentedControlVariants = cva(
  'border-border bg-primary inline-flex items-center gap-1 rounded-lg border p-0.5',
  {
    variants: {
      size: {
        s: '',
        m: '',
      },
    },
    defaultVariants: {
      size: 'm',
    },
  },
);

const segmentedControlItemVariants = cva(
  [
    'text-subdued/70 relative inline-flex cursor-pointer items-center justify-center lg:whitespace-nowrap rounded-md transition-all',
    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'hover:text-default',
    'data-[state=checked]:bg-hover data-[state=checked]:text-default data-[state=checked]:shadow-sm',
  ],
  {
    variants: {
      size: {
        s: 'px-2.5 py-1.5 text-2xs min-h-[30px]',
        m: 'px-3 py-1.5 text-xs/4 min-h-[30px]',
      },
    },
    defaultVariants: {
      size: 'm',
    },
  },
);

interface SegmentedControlProps extends VariantProps<typeof segmentedControlVariants> {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  id,
  ariaLabel,
  ariaLabelledBy,
  disabled = false,
  className,
  itemClassName,
  size,
}) => {
  return (
    <RadioGroupPrimitive
      id={id}
      data-slot="segmented-control"
      className={cn(segmentedControlVariants({ size }), className)}
      value={value}
      onValueChange={onChange}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled}
      orientation="horizontal"
      loop={false}
    >
      {options.map((option) => (
        <RadioGroupItemPrimitive
          key={option.value}
          data-slot="segmented-control-item"
          value={option.value}
          id={id ? `${id}-${option.value}` : undefined}
          aria-label={option.label}
          disabled={disabled || option.disabled}
          className={cn(segmentedControlItemVariants({ size }), itemClassName)}
        >
          <RadioGroupIndicatorPrimitive asChild>
            <span className="sr-only" />
          </RadioGroupIndicatorPrimitive>
          {option.label}
        </RadioGroupItemPrimitive>
      ))}
    </RadioGroupPrimitive>
  );
};
