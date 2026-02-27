import { usePagination, useSearch, useSorting } from '@/hooks';
import type { UpdatePipelineRequest } from '@/models/providers/Types/Request';
import { usePipelinesStore } from '@/store/pipelines';
import { convertSortingToApiParams } from '@/utils/tableSorting';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { createColumns } from './columns';

export const usePipelines = () => {
  const { loading, fetchPipelines, updatePipeline } = usePipelinesStore();
  const pipelines = usePipelinesStore((state) => state.pipelines);
  const [switchLoading, setSwitchLoading] = useState(false);
  const { search, debouncedSearch, setSearch } = useSearch();
  const { page, limit, setPage, setLimit } = usePagination();
  const { sorting, handleSortingChange } = useSorting({ setPage });

  const pipelinesData = useMemo(() => pipelines?.data || [], [pipelines]);
  const total = useMemo(() => pipelines?.total || 0, [pipelines?.total]);
  const totalPages = Math.ceil(total / limit);

  const buildFetchParams = useCallback(() => {
    const { sort, order } = convertSortingToApiParams(sorting);
    const offset = (page - 1) * limit;
    
    return {
      page,
      offset,
      limit,
      search: debouncedSearch || undefined,
      sort: sort || 'created',
      order: order || 'desc',
    };
  }, [page, limit, debouncedSearch, sorting]);

  useEffect(() => {
    fetchPipelines(buildFetchParams());
  }, [buildFetchParams, fetchPipelines]);

  const handleTogglePipelineStatus = useCallback(
    async (pipelineId: string, enabled: boolean) => {
      setSwitchLoading(true);
      try {
        const result = await updatePipeline(
          pipelineId,
          { enabled } as UpdatePipelineRequest,
          false,
        );
        await fetchPipelines(buildFetchParams(), false);
        toast.success(`Pipeline ${enabled ? 'enabled' : 'disabled'} successfully`);
        return result;
      } catch (error) {
        toast.error('Failed to update pipeline status');
        console.error('Failed to toggle pipeline status:', error);
        throw error;
      } finally {
        setSwitchLoading(false);
      }
    },
    [updatePipeline, fetchPipelines, buildFetchParams],
  );

  const columns = useMemo(
    () =>
      createColumns({
        switchLoading,
        togglePipelineStatus: handleTogglePipelineStatus,
      }),
    [switchLoading, handleTogglePipelineStatus],
  );

  const table = useReactTable({
    data: pipelinesData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  return {
    loading,
    table,
    data: pipelinesData,
    search,
    page,
    limit,
    columns,
    totalPages,
    setPage,
    setSearch,
    setLimit,
  };
};
