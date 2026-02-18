import { SortingState } from '@tanstack/react-table';
import { useState } from 'react';

interface UseSortingProps {
  setPage?: (page: number) => void;
}

export const useSorting = ({ setPage }: UseSortingProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const handleSortingChange = (updater: any) => {
    setSorting(updater);
    setPage?.(1);
  };

  return {
    sorting,
    handleSortingChange,
  };
};
