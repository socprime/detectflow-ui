import { toast } from '@/utils/toast';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createColumns } from './columns';
import { getFlatListItems, getServerGroups, isServerGroupedView } from './utils';

import { usePagination } from '@/hooks/usePagination';
import { useReturnTo } from '@/hooks/useReturnTo';
import { useSearch } from '@/hooks/useSearch';
import { useSorting } from '@/hooks/useSorting';
import {
  type AttackChainsGroupBy,
  type AttackChainsParams,
  type CorrelationPipelineJobsStatus,
  OrderBy,
} from '@/models/providers';
import { stringsToSelectOptions, withAllOption } from '@/pages/AttackChains/utils';
import { useAttackChainsStore } from '@/store/attackChains/attackChains';
import { useCorrelationPipelinesStore } from '@/store/correlationPipelines';
import { convertSortingToApiParams } from '@/utils/tableSorting';

type AttackChainsFilters = {
  group: AttackChainsGroupBy;
  severity: string;
  status: string;
  pipeline: string;
};

export type PipelineSelectOption = {
  label: string;
  value: string;
  status?: CorrelationPipelineJobsStatus;
};

const initialFilters: AttackChainsFilters = {
  group: 'none',
  severity: 'all',
  status: 'all',
  pipeline: 'all',
};

export const useAttackChainsTab = () => {
  const loading = useAttackChainsStore((state) => state.loading);
  const error = useAttackChainsStore((state) => state.error);
  const data = useAttackChainsStore((state) => state.data);
  const attackChainsFilters = useAttackChainsStore((state) => state.filters?.attack_chains);
  const fetchList = useAttackChainsStore((state) => state.fetchList);
  const clearError = useAttackChainsStore((state) => state.clearError);
  const correlationPipelines = useCorrelationPipelinesStore((state) => state.list);
  const fetchCorrelationPipelines = useCorrelationPipelinesStore((state) => state.fetchList);
  const subscribeLiveUpdates = useAttackChainsStore((state) => state.subscribeLiveUpdates);
  const unsubscribeLiveUpdates = useAttackChainsStore((state) => state.unsubscribeLiveUpdates);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [showFilteredOut, setShowFilteredOut] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const { search, debouncedSearch, setSearch } = useSearch();
  const { page, limit, setPage, setLimit } = usePagination();
  const { sorting, handleSortingChange } = useSorting({ setPage });

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error(error);
    clearError();
  }, [error, clearError]);

  const buildFetchParams = useCallback((): AttackChainsParams => {
    const { sort, order } = convertSortingToApiParams(sorting);
    const params: AttackChainsParams = {
      page,
      limit,
      search: debouncedSearch || undefined,
      sort: sort || 'last_seen',
      order: order || OrderBy.DESC,
      group_by: filters.group,
      show_filtered_out: showFilteredOut,
    };

    if (filters.severity !== 'all') {
      params.severity = [filters.severity];
    }

    if (filters.status !== 'all') {
      params.status = [filters.status];
    }

    if (filters.pipeline !== 'all') {
      params.correlation_pipeline_id = filters.pipeline;
    }

    return params;
  }, [page, limit, debouncedSearch, filters, showFilteredOut, sorting]);

  useEffect(() => {
    fetchList(buildFetchParams());
  }, [buildFetchParams, fetchList]);

  useEffect(() => {
    fetchCorrelationPipelines({ limit: 100 }, false);
  }, [fetchCorrelationPipelines]);

  useEffect(() => {
    subscribeLiveUpdates();
    return () => unsubscribeLiveUpdates();
  }, [subscribeLiveUpdates, unsubscribeLiveUpdates]);

  useEffect(() => {
    setExpandedGroups({});
  }, [filters.group, data?.group_by]);

  const totalPages = useMemo(() => {
    if (!data) {
      return 1;
    }

    return Math.max(1, Math.ceil(data.total / limit));
  }, [data, limit]);

  const listItems = useMemo(() => getFlatListItems(data), [data]);
  const serverGroups = useMemo(() => getServerGroups(data), [data]);

  const isGroupedView = useMemo(
    () => isServerGroupedView(filters.group, data),
    [filters.group, data],
  );

  const filterSelectOptions = useMemo(
    () => ({
      group: attackChainsFilters?.group ?? [],
      severity: withAllOption(
        'All Severities',
        stringsToSelectOptions(attackChainsFilters?.severity),
      ),
      status: withAllOption('All Statuses', stringsToSelectOptions(attackChainsFilters?.status)),
      pipeline: withAllOption<PipelineSelectOption>(
        'All Correlation Pipelines',
        (correlationPipelines?.data ?? []).map(({ id, name, jobs_status }) => ({
          label: name,
          value: id,
          status: jobs_status,
        })),
      ),
    }),
    [attackChainsFilters, correlationPipelines],
  );

  const handleFilterChange = useCallback(
    (value: string, filter: keyof AttackChainsFilters) => {
      setFilters((prev) => ({ ...prev, [filter]: value }));
      setPage(1);
    },
    [setPage],
  );

  const toggleGroupExpansion = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  }, []);

  const returnTo = useReturnTo();
  const columns = useMemo(() => createColumns(returnTo), [returnTo]);

  const table = useReactTable({
    data: listItems,
    columns,
    state: {
      sorting,
    },
    onSortingChange: handleSortingChange,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const handleShowFilteredOut = useCallback(() => {
    setShowFilteredOut((prev) => !prev);
    setPage(1);
  }, [setPage]);

  return {
    loading,
    data,
    table,
    columns,
    page,
    limit,
    totalPages,
    search,
    filters,
    filterSelectOptions,
    isGroupedView,
    serverGroups,
    expandedGroups,
    showFilteredOut,
    handleShowFilteredOut,
    toggleGroupExpansion,
    setSearch,
    handleFilterChange,
    setPage,
    setLimit,
  };
};
