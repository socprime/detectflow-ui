import { useEffect, useMemo } from 'react';

import { useSearch } from '@/hooks';
import { OrderBy } from '@/models/providers';
import { useLogSourcesStore } from '@/store/logSources';

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
      order: OrderBy.DESC,
    });
  }, [debouncedSearch, fetchLogSources]);

  return {
    loading,
    logSources,
    search,
    setSearch,
  };
};
