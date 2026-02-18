import { cva, type VariantProps } from 'class-variance-authority';
import { XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-2xs transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        purple:
          'border-purple/20 font-normal text-2xs bg-purple/10 text-default shadow hover:bg-purple/20',
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        warning:
          'border-warning/20 font-normal text-2xs bg-warning/10 text-default shadow hover:bg-warning/20',
        critical:
          'border-critical/20 font-normal text-2xs bg-critical/10 text-default shadow hover:bg-critical/20',
        secondary: 'border-border bg-secondary text-subdued hover:bg-secondary/80',
        outline: 'text-foreground border-border',
        success:
          'border-success/20 font-normal text-2xs bg-success/10 text-default shadow hover:bg-success/20',
        lightBlue:
          'border-light-blue/20 font-normal text-2xs bg-light-blue/10 text-default shadow hover:bg-light-blue/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  onRemove?: () => void;
}

function Badge({ className, variant, onRemove, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }
          }}
          className="hover:text-default/30 focus:ring-success/40 ml-1 cursor-pointer rounded-sm focus:ring-2 focus:outline-none"
        >
          <XIcon className="size-3 text-inherit" />
        </span>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
