import { usePagination, useSearch, useSorting } from '@/hooks';
import { PaginationParams } from '@/models/providers/Types/Request';
import { usePipelinesStore } from '@/store/pipelines';
import { convertSortingToApiParams } from '@/utils/tableSorting';
import { getCoreRowModel, type RowSelectionState, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { createColumns } from './columns';

export interface RuleDialogParams {
  ruleId: string;
  repositoryId?: string;
}

export const usePipelineDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pipelineId = searchParams.get('pipelineId');
  const ruleIdFromUrl = searchParams.get('ruleId');
  const {
    loading,
    loadingRules,
    pipeline,
    pipelineRules,
    fetchPipelineById,
    fetchPipelineRules,
    updatePipelineRule,
  } = usePipelinesStore();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(!!ruleIdFromUrl);
  const { search, debouncedSearch, setSearch } = useSearch();
  const { page, limit, setPage, setLimit } = usePagination();
  const { sorting, handleSortingChange } = useSorting({ setPage });
  const taggedFilterFromUrl = searchParams.get('tagged_filter');
  const [hideUnmatchedRules, setHideUnmatchedRules] = useState(taggedFilterFromUrl === 'tagged');
  const [checkboxLoading, setCheckboxLoading] = useState(false);

  const rules = useMemo(() => pipelineRules?.data || [], [pipelineRules]);
  const total = useMemo(() => pipelineRules?.total || 0, [pipelineRules?.total]);
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  useEffect(() => {
    if (pipelineId) {
      fetchPipelineById(pipelineId);
    }
  }, [pipelineId, fetchPipelineById]);

  useEffect(() => {
    const isTaggedOnly = searchParams.get('tagged_filter') === 'tagged';
    if (isTaggedOnly !== hideUnmatchedRules) {
      setHideUnmatchedRules(isTaggedOnly);
    }
  }, [searchParams, hideUnmatchedRules]);

  const selectedRuleIds = useMemo(() => Object.keys(rowSelection), [rowSelection]);

  const params: PaginationParams = useMemo(() => {
    const { sort, order } = convertSortingToApiParams(sorting);
    const offset = (page - 1) * limit;

    return {
      page,
      offset,
      limit,
      search: debouncedSearch || undefined,
      tagged_filter: hideUnmatchedRules ? 'tagged' : undefined,
      sort: sort || 'name',
      order: order || 'asc',
    };
  }, [debouncedSearch, page, limit, sorting, hideUnmatchedRules]);

  const handleActivateRules = useCallback(
    async (status: 'enable' | 'disable') => {
      if (!pipelineId || selectedRuleIds.length === 0) {
        return;
      }

      setCheckboxLoading(true);

      try {
        const promises = selectedRuleIds.map((ruleId) =>
          updatePipelineRule(pipelineId, ruleId, status, false),
        );
        await Promise.all(promises);

        toast.success(
          `Successfully ${status === 'enable' ? 'activated' : 'deactivated'} ${selectedRuleIds.length} rule${selectedRuleIds.length > 1 ? 's' : ''}`,
        );
        fetchPipelineById(pipelineId);
        fetchPipelineRules(pipelineId, params, false);
        setRowSelection({});
      } catch (error) {
        toast.error(`Failed to ${status === 'enable' ? 'activate' : 'deactivate'} rules`);
        console.error('Failed to update rules:', error);
      } finally {
        setCheckboxLoading(false);
      }
    },
    [selectedRuleIds],
  );

  useEffect(() => {
    let isActvie = true;

    if (pipelineId && isActvie && params) {
      fetchPipelineRules(pipelineId, params);
      isActvie = false;
    }
  }, [pipelineId, params]);

  const handleCloseRuleDialog = useCallback(() => {
    setIsRuleDialogOpen(false);
    searchParams.delete('ruleId');
    searchParams.delete('repositoryId');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleTaggedFilterChange = useCallback(
    (checked: boolean) => {
      setHideUnmatchedRules(checked);
      if (checked) {
        searchParams.set('tagged_filter', 'tagged');
      } else {
        searchParams.delete('tagged_filter');
      }
      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleOpenRuleDialogWithId = useCallback(
    ({ ruleId, repositoryId }: RuleDialogParams) => {
      searchParams.set('ruleId', ruleId);
      if (repositoryId) {
        searchParams.set('repositoryId', repositoryId);
      }
      setSearchParams(searchParams, { replace: true });
      setIsRuleDialogOpen(true);
    },
    [searchParams, setSearchParams],
  );

  const columns = useMemo(
    () => createColumns(checkboxLoading, handleOpenRuleDialogWithId),
    [checkboxLoading, handleOpenRuleDialogWithId],
  );

  const table = useReactTable({
    data: rules,
    columns,
    state: {
      rowSelection,
      sorting,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
  });

  return {
    loading,
    loadingRules,
    isRuleDialogOpen,
    checkboxLoading,
    rules,
    pipeline,
    selectedRules: selectedRuleIds,
    rowSelection,
    columns,
    table,
    page,
    limit,
    totalPages,
    search,
    hideUnmatchedRules,
    setHideUnmatchedRules: handleTaggedFilterChange,
    setPage,
    setSearch,
    setLimit,
    handleCloseRuleDialog,
    handleActivateRules,
  };
};
