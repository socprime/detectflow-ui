import { cn } from '@/utils';
import { TableBody, TableCell, TableRow } from '../../Table';

interface SkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const Skeleton = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-hover animate-pulse rounded-md', className)}
      {...props}
    />
  );
};

export const SkeletonTable = ({ className, rows = 10, columns = 5 }: SkeletonProps) => {
  return (
    <TableBody className={className}>
      {Array.from({ length: rows }).map((_, row) => (
        <TableRow className="hover:bg-transparent" key={row.toString()}>
          {Array.from({ length: columns }).map((_, column) => (
            <TableCell className="border-transparent px-6 py-4" key={column.toString()}>
              <Skeleton className="h-4 w-full" key={column.toString()} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};
