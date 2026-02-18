import { cn } from '@/utils';
import { ScrollArea, type ScrollAreaOrientation } from '../ScrollArea';

interface TableProps extends React.ComponentProps<'table'> {
  orientation?: ScrollAreaOrientation;
  classNameScrollArea?: string;
}

export const Table: React.FC<TableProps> = ({
  className,
  orientation = 'both',
  classNameScrollArea,
  ...props
}) => {
  return (
    <div className="border-border bg-primary flex overflow-hidden rounded-md border">
      <ScrollArea className={cn('w-1 flex-1', classNameScrollArea)} orientation={orientation}>
        <table data-slot="table" className={cn('w-full caption-bottom', className)} {...props} />
      </ScrollArea>
    </div>
  );
};

export const TableHeader: React.FC<React.ComponentProps<'thead'>> = ({ className, ...props }) => {
  return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />;
};

export const TableBody: React.FC<React.ComponentProps<'tbody'>> = ({ className, ...props }) => {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
};

export const TableFooter: React.FC<React.ComponentProps<'tfoot'>> = ({ className, ...props }) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
};

export const TableRow: React.FC<React.ComponentProps<'tr'>> = ({ className, ...props }) => {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'hover:bg-hover/20 data-[state=selected]:bg-secondary/80 border-border border-b transition-colors',
        className,
      )}
      {...props}
    />
  );
};

export const TableHead: React.FC<React.ComponentProps<'th'>> = ({ className, ...props }) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-subdued text-2xs px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
};

export const TableCell: React.FC<React.ComponentProps<'td'>> = ({ className, ...props }) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
};

export const TableCaption: React.FC<React.ComponentProps<'caption'>> = ({
  className,
  ...props
}) => {
  return (
    <caption
      data-slot="table-caption"
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  );
};
