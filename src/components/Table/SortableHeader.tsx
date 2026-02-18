import { cn } from '@/utils';
import { Header } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import React from 'react';

interface SortableHeaderProps {
  header: Header<any, unknown>;
  isSortingEnabled: boolean;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  header,
  isSortingEnabled,
}) => {
  const canSort = header.column.getCanSort();
  const isSorted = header.column.getIsSorted();
  const sortDirection =
    isSorted === 'asc' ? 'asc' : isSorted === 'desc' ? 'desc' : null;

  if (!canSort || !isSortingEnabled) {
    return null;
  }

  return (
    <span
      className={cn(
        'flex flex-col',
        !isSorted && 'opacity-0 transition-opacity group-hover:opacity-100',
      )}
    >
      <ChevronUpIcon
        className={cn(
          'size-3',
          sortDirection === 'asc' ? 'text-success' : 'text-subdued opacity-30',
        )}
      />
      <ChevronDownIcon
        className={cn(
          '-mt-1 size-3',
          sortDirection === 'desc' ? 'text-success' : 'text-subdued opacity-30',
        )}
      />
    </span>
  );
};

