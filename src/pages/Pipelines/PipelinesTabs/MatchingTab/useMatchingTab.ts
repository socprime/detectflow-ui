import { toast } from '@/utils/toast';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createColumns } from './columns';

import { usePagination, usePermissions, useReturnTo, useSearch, useSorting } from '@/hooks';
import { OrderBy, type UpdatePipelineRequest } from '@/models/providers/Types/Request';
import { usePipelinesStore } from '@/store/pipelines';
import { convertSortingToApiParams } from '@/utils/tableSorting';

export const useMatchingTab = () => {
  const { isViewer } = usePermissions();
  const { loading, fetchPipelines, updatePipeline } = usePipelinesStore();
  const pipelines = usePipelinesStore((state) => state.pipelines);
  const [switchLoading, setSwitchLoading] = useState(false);
  const { search, debouncedSearch, setSearch } = useSearch();
  const { page, limit, setPage, setLimit } = usePagination();
  const { sorting, handleSortingChange } = useSorting({ setPage });
  const duplicatePipeline = usePipelinesStore((state) => state.duplicatePipeline);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const returnTo = useReturnTo();

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
      order: order || OrderBy.DESC,
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

  const handleDuplicateSuccess = useCallback(async () => {
    await fetchPipelines(buildFetchParams(), false);
  }, [fetchPipelines, buildFetchParams]);

  const handleDuplicate = useCallback(
    async (pipelineId: string) => {
      if (isDuplicating) {
        return;
      }

      setIsDuplicating(true);
      try {
        const result = await duplicatePipeline(pipelineId);
        toast.success(result.message || 'Pipeline duplicated successfully');
        await handleDuplicateSuccess();
      } catch (error) {
        console.error('Failed to duplicate pipeline:', error);
        toast.error('Failed to duplicate pipeline');
      } finally {
        setIsDuplicating(false);
      }
    },
    [duplicatePipeline, isDuplicating, handleDuplicateSuccess],
  );

  const columns = useMemo(
    () =>
      createColumns({
        isViewer,
        isDuplicating,
        switchLoading,
        returnTo,
        togglePipelineStatus: handleTogglePipelineStatus,
        onDuplicate: handleDuplicate,
      }),
    [isViewer, isDuplicating, switchLoading, returnTo, handleTogglePipelineStatus, handleDuplicate],
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
