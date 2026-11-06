import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { createColumns } from './columns';

import { usePagination, useReturnTo, useSearch, useSorting } from '@/hooks';
import { OrderBy } from '@/models/providers/Types/Request';
import { usePresetsStore } from '@/store/presets';
import { convertSortingToApiParams } from '@/utils/tableSorting';

export const usePresets = () => {
  const { loading, presets, fetchPresets } = usePresetsStore();
  const { search, debouncedSearch, setSearch } = useSearch();
  const { page, limit, setPage, setLimit } = usePagination();
  const { sorting, handleSortingChange } = useSorting({ setPage });
  const returnTo = useReturnTo();
  const columns = useMemo(() => createColumns(returnTo), [returnTo]);

  const totalPages = useMemo(() => {
    return Math.ceil((presets?.total ?? 0) / limit);
  }, [presets?.total, limit]);

  useEffect(() => {
    const { sort, order } = convertSortingToApiParams(sorting);

    fetchPresets({
      offset: (page - 1) * limit,
      limit,
      search: debouncedSearch || undefined,
      sort: sort || 'created',
      order: order || OrderBy.DESC,
    });
  }, [page, limit, debouncedSearch, fetchPresets, sorting]);

  const table = useReactTable({
    data: presets?.data || [],
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
    setLimit,
  };
};
