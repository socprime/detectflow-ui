import { usePagination, useSearch } from '@/hooks';
import { useLogSourcesStore } from '@/store/logSources';
import { useEffect, useMemo } from 'react';

export const useLogSources = () => {
  const { loading, logSources: logSourcesList, fetchLogSources } = useLogSourcesStore();
  const { page, limit, setPage, setLimit } = usePagination();
  const { search, debouncedSearch, setSearch } = useSearch();

  const logSources = useMemo(() => {
    return logSourcesList?.data || [];
  }, [logSourcesList]);

  const totalPages = useMemo(() => {
    return Math.ceil((logSourcesList?.total ?? 0) / limit);
  }, [logSourcesList?.total, limit]);

  useEffect(() => {
    const offset = (page - 1) * limit;
    fetchLogSources({
      offset,
      limit,
      search: debouncedSearch || undefined,
      sort: 'created',
      order: 'desc',
    });
  }, [page, limit, debouncedSearch, fetchLogSources]);

  return {
    loading,
    logSources,
    search,
    page,
    limit,
    totalPages,
    setSearch,
    setPage,
    setLimit,
  };
};
