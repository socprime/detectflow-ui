import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { buildRuleEditLink, buildRuleViewLink } from '../repositoryNavigation';
import { createHOSRulesColumns } from './columns';

import { useReturnTo, useSorting } from '@/hooks';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/hooks/useSearch';
import { OrderBy } from '@/models/providers/Types/Request';
import { useHighOrderSigmasStore } from '@/store/highOrderSigmas';
import { convertSortingToApiParams, withReturnTo } from '@/utils';

export const useHOSRules = () => {
  const loading = useHighOrderSigmasStore((state) => state.loading);
  const list = useHighOrderSigmasStore((state) => state.list);
  const fetchList = useHighOrderSigmasStore((state) => state.fetchList);
  const { page, limit, setPage, setLimit } = usePagination();
  const { search, debouncedSearch, setSearch } = useSearch();
  const { sorting, handleSortingChange } = useSorting({ setPage });

  const totalPages = useMemo(() => {
    return Math.ceil((list?.total ?? 0) / limit);
  }, [list?.total, limit]);

  const params = useMemo(() => {
    const { sort, order } = convertSortingToApiParams(sorting);
    return {
      offset: (page - 1) * limit,
      limit,
      search: debouncedSearch || undefined,
      sort: sort || 'created',
      order: order || OrderBy.DESC,
    };
  }, [page, limit, debouncedSearch, sorting]);

  useEffect(() => {
    fetchList(params);
  }, [params, fetchList]);

  const returnTo = useReturnTo();

  const columns = useMemo(
    () =>
      createHOSRulesColumns(
        (repositoryId, ruleId, folderPath) =>
          withReturnTo(buildRuleViewLink(repositoryId, ruleId, folderPath), returnTo),
        buildRuleEditLink,
      ),
    [returnTo],
  );
  const table = useReactTable({
    data: list?.data || [],
    columns,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: handleSortingChange,
  });

  return {
    loading,
    page,
    total: list?.total || 0,
    table,
    columns,
    search,
    totalPages,
    limit,
    setSearch,
    setPage,
    setLimit,
  };
};
