import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { columns } from './columns';

import { usePagination, useSorting } from '@/hooks';
import { OrderBy } from '@/models/providers';
import { useFiltersStore } from '@/store';
import { convertSortingToApiParams } from '@/utils/tableSorting';

export const useFilterPipelineTab = (search: string) => {
  const { loading, filters, fetchFilters } = useFiltersStore();
  const { page, limit, setPage, setLimit } = usePagination();
  const { sorting, handleSortingChange } = useSorting({ setPage });

  const totalPages = useMemo(() => {
    return Math.ceil((filters?.total ?? 0) / limit);
  }, [filters?.total, limit]);

  useEffect(() => {
    const { sort, order } = convertSortingToApiParams(sorting);
    fetchFilters({
      offset: (page - 1) * limit,
      limit,
      search: search || undefined,
      sort: sort || 'created',
      order: order || OrderBy.DESC,
    });
  }, [page, limit, search, fetchFilters, sorting]);

  const table = useReactTable({
    data: filters?.data || [],
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: handleSortingChange,
  });

  return {
    loading,
    table,
    totalPages,
    page,
    limit,
    columns,
    setPage,
    setLimit,
  };
};
