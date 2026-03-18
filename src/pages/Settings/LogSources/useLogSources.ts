import { useSearch } from '@/hooks';
import { useLogSourcesStore } from '@/store/logSources';
import { useEffect, useMemo } from 'react';

export const useLogSources = () => {
  const { loading, logSources: logSourcesList, fetchLogSources } = useLogSourcesStore();
  const { search, debouncedSearch, setSearch } = useSearch();

  const logSources = useMemo(() => {
    return logSourcesList?.data || [];
  }, [logSourcesList]);

  useEffect(() => {
    fetchLogSources({
      limit: 100,
      search: debouncedSearch || undefined,
      sort: 'created',
      order: 'desc',
    });
  }, [debouncedSearch, fetchLogSources]);

  return {
    loading,
    logSources,
    search,
    setSearch,
  };
};
