import { toast } from '@/utils/toast';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createColumns } from './columns';

import { usePagination, usePermissions, useReturnTo, useSearch, useSorting } from '@/hooks';
import type { CorrelationPipelinesParams } from '@/models/providers/Types/Request';
import type { CorrelationPipelineListItem } from '@/models/providers/Types/responses/correlationPipelines';
import { useCorrelationPipelinesStore } from '@/store/correlationPipelines';
import { convertSortingToApiParams } from '@/utils/tableSorting';

export const useChainingTab = () => {
  const loading = useCorrelationPipelinesStore((state) => state.loading);
  const list = useCorrelationPipelinesStore((state) => state.list);
  const fetchList = useCorrelationPipelinesStore((state) => state.fetchList);
  const run = useCorrelationPipelinesStore((state) => state.run);
  const stop = useCorrelationPipelinesStore((state) => state.stop);
  const duplicate = useCorrelationPipelinesStore((state) => state.duplicate);
  const remove = useCorrelationPipelinesStore((state) => state.remove);
  const { isViewer } = usePermissions();

  const [switchLoading, setSwitchLoading] = useState(false);
  const returnTo = useReturnTo();
  const { search, debouncedSearch, setSearch } = useSearch();
  const { page, limit, setPage, setLimit } = usePagination();
  const { sorting, handleSortingChange } = useSorting({ setPage });

  const pipelinesData = useMemo(() => list?.data || [], [list]);
  const total = useMemo(() => list?.total || 0, [list?.total]);
  const totalPages = Math.ceil(total / limit);

  const buildFetchParams = useCallback((): CorrelationPipelinesParams => {
    const { sort, order } = convertSortingToApiParams(sorting);
    const params: CorrelationPipelinesParams = {
      page,
      offset: (page - 1) * limit,
      limit,
      search: debouncedSearch || undefined,
    };
    if (sort) {
      params.sort = sort;
      params.order = order;
    }
    return params;
  }, [page, limit, debouncedSearch, sorting]);

  useEffect(() => {
    fetchList(buildFetchParams());
  }, [buildFetchParams, fetchList]);

  const refetchList = useCallback(
    () => fetchList(buildFetchParams(), false),
    [fetchList, buildFetchParams],
  );

  const handleRunStop = useCallback(
    async (pipeline: CorrelationPipelineListItem, shouldRun: boolean) => {
      setSwitchLoading(true);
      try {
        if (shouldRun) {
          await run(pipeline.id, false);
        } else {
          await stop(pipeline.id, false);
        }
        toast.success(`Pipeline "${pipeline.name}" ${shouldRun ? 'started' : 'stopped'}`);
        await refetchList();
      } catch (error) {
        toast.error(`Failed to ${shouldRun ? 'start' : 'stop'} pipeline`);
        console.error('Failed to toggle correlation pipeline:', error);
      } finally {
        setSwitchLoading(false);
      }
    },
    [run, stop, refetchList],
  );

  const handleDuplicate = useCallback(
    async (pipeline: CorrelationPipelineListItem) => {
      try {
        const result = await duplicate(pipeline.id, false);
        toast.success(`Pipeline "${result.name}" created`);
        result.warnings?.forEach((warning) => toast.error(warning));
        await refetchList();
      } catch (error) {
        toast.error('Failed to duplicate pipeline');
        console.error('Failed to duplicate chaining pipeline:', error);
      }
    },
    [duplicate, refetchList],
  );

  const handleDelete = useCallback(
    async (pipeline: CorrelationPipelineListItem) => {
      try {
        await remove(pipeline.id, false);
        toast.success(`Pipeline "${pipeline.name}" deleted`);
        await refetchList();
      } catch (error) {
        toast.error('Failed to delete pipeline');
        console.error('Failed to delete chaining pipeline:', error);
        throw error;
      }
    },
    [remove, refetchList],
  );

  const columns = useMemo(
    () =>
      createColumns({
        switchLoading,
        returnTo,
        isViewer,
        onRunStop: handleRunStop,
        onDuplicate: handleDuplicate,
        onDelete: handleDelete,
      }),
    [switchLoading, returnTo, isViewer, handleRunStop, handleDuplicate, handleDelete],
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
