import { cn } from '@/utils';
import { ColumnDef, flexRender, type Table as TableType } from '@tanstack/react-table';
import { DatabaseIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { memo } from 'react';
import { ConditionalContent } from '../ConditionalContent';
import { EmptyState } from '../EmptyState';
import { SkeletonTable } from '../Loading/Skeleton';
import { type ScrollAreaOrientation, type ScrollAreaProps } from '../ScrollArea';
import { SortableHeader } from './SortableHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';

interface TableWrapProps<T> extends Omit<ScrollAreaProps, 'children'> {
  classNameScrollArea?: string;
  table: TableType<T>;
  columns: ColumnDef<T>[];
  data?: T[];
  orientation?: ScrollAreaOrientation;
  loading?: boolean;
  rowSelection?: Record<string, boolean>;
  loadedContent?: React.ReactNode;
  classNameHeader?: string;
  classNameCell?: string;
}

function TableWrapInner<T>({
  classNameScrollArea,
  table,
  columns,
  data: _data,
  orientation = 'both',
  loading = false,
  rowSelection: _rowSelection,
  loadedContent,
  classNameHeader,
  classNameCell,
}: TableWrapProps<T>) {
  return (
    <Table
      className="text-xs font-normal"
      orientation={orientation}
      classNameScrollArea={classNameScrollArea}
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const width = (header.column.columnDef.meta as { width?: string })?.width;
              const canSort = header.column.getCanSort();
              const isSortingEnabled = table.options.enableSorting !== false;

              return (
                <TableHead
                  className={cn(
                    'bg-secondary px-6 py-3',
                    classNameHeader,
                    canSort &&
                      isSortingEnabled &&
                      'hover:bg-muted/50 group cursor-pointer select-none',
                  )}
                  key={header.id}
                  style={width ? { width, minWidth: width } : undefined}
                  onClick={
                    canSort && isSortingEnabled
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                >
                  <div className="flex items-center gap-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    <SortableHeader header={header} isSortingEnabled={isSortingEnabled} />
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <ConditionalContent
        loading={loading}
        loadingContent={<SkeletonTable rows={10} columns={columns.length} />}
        loadedContent={
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <AnimatePresence mode="popLayout">
                {table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'hover:bg-hover/20 data-[state=selected]:bg-secondary/80 border-border border-b transition-colors',
                    )}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const width = (cell.column.columnDef.meta as { width?: string })?.width;
                      return (
                        <TableCell
                          className={cn('px-6 py-4', classNameCell)}
                          key={cell.id}
                          style={width ? { width, minWidth: width } : undefined}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </motion.tr>
                ))}
              </AnimatePresence>
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {loadedContent || (
                    <EmptyState
                      Icon={DatabaseIcon}
                      title="No data"
                      description="Results will be displayed here after you add some data"
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        }
      />
    </Table>
  );
}

export const TableWrap = memo(TableWrapInner) as typeof TableWrapInner;
