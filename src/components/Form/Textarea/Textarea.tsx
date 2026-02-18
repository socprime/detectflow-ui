import * as React from 'react';

import { cn } from '@/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-border bg-secondary placeholder:text-gray-chateau focus-visible:border-ring focus-visible:ring-secondary/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base text-xs shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:ring-success/40 focus-visible:border-success focus-visible:ring-[2px]',
        'aria-invalid:ring-critical/40 aria-invalid:border-critical aria-invalid:ring-[2px]',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
