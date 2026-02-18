import { usePagination, useSearch, useSorting } from '@/hooks';
import { useFiltersStore } from '@/store/filters';
import { convertSortingToApiParams } from '@/utils/tableSorting';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { columns } from './columns';

export const useFilters = () => {
  const { loading, filters, fetchFilters } = useFiltersStore();
  const { search, debouncedSearch, setSearch } = useSearch();
  const { page, limit, setPage } = usePagination();
  const { sorting, handleSortingChange } = useSorting({ setPage });

  const totalPages = useMemo(() => {
    return Math.ceil((filters?.total ?? 0) / limit);
  }, [filters?.total, limit]);

  useEffect(() => {
    const { sort, order } = convertSortingToApiParams(sorting);
    fetchFilters({
      offset: (page - 1) * limit,
      limit,
      search: debouncedSearch || undefined,
      sort: sort || 'created',
      order: order || 'desc',
    });
  }, [page, limit, debouncedSearch, fetchFilters, sorting]);

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
    search,
    table,
    totalPages,
    page,
    limit,
    columns,
    setSearch,
    setPage,
  };
};
