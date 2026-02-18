import { usePagination, useSearch } from '@/hooks';
import { useTopicsStore } from '@/store/topics';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { columns } from './columns';

export const useTopics = () => {
  const loading = useTopicsStore((state) => state.loading);
  const topics = useTopicsStore((state) => state.topics);
  const fetchTopics = useTopicsStore((state) => state.fetchTopics);
  const { page, limit, setPage } = usePagination();
  const { search, debouncedSearch, setSearch } = useSearch();

  const topicsData = useMemo(() => {
    return topics?.data || [];
  }, [topics]);

  const totalPages = useMemo(() => {
    return Math.ceil((topics?.total ?? 0) / limit);
  }, [topics?.total, limit]);

  const params = useMemo(() => {
    return {
      offset: (page - 1) * limit,
      limit,
      search: debouncedSearch || undefined,
      sort: 'created',
      order: 'desc' as const,
    };
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchTopics(params);
  }, [fetchTopics, params]);

  const handleSyncTopics = useCallback(async () => {
    try {
      await fetchTopics(params);
      toast.success('Topics synced successfully');
    } catch (error) {
      toast.error('Failed to refresh topics');
      console.error('Failed to refresh topics:', error);
    }
  }, [fetchTopics, params]);

  const table = useReactTable({
    data: topicsData,
    columns,
    enableSorting: false,
    manualSorting: false,
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    loading,
    table,
    topicsData,
    columns,
    page,
    limit,
    totalPages,
    search,
    handleSyncTopics,
    setPage,
    setSearch,
  };
};
