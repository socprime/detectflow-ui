import { toast } from '@/utils/toast';
import { getCoreRowModel, type RowSelectionState, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { columns } from './columns';

import { useModal, useReturnTo, useSorting } from '@/hooks';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/hooks/useSearch';
import { type ActiveThreatsParams, OrderBy } from '@/models/providers/Types/Request';
import type { ActiveThreatListItem } from '@/models/providers/Types/responses/activeThreats';
import { stringsToSelectOptions, withAllOption } from '@/pages/AttackChains/utils';
import { useActiveThreatsStore } from '@/store/activeThreats';
import { useAttackChainsStore } from '@/store/attackChains/attackChains';
import { useCorrelationPipelinesStore } from '@/store/correlationPipelines';
import { convertSortingToApiParams } from '@/utils/tableSorting';

const initialFilters = {
  pipeline: 'all',
  severity: 'all',
  industry: 'all',
  threatType: 'all',
  region: 'all',
};

type ConfirmMode = 'enable' | 'disable';

const CORRELATION_PIPELINES_LIMIT = 100;

export const useMonitoredThreatsTab = () => {
  const { isOpen, openModal, toggleModal } = useModal();
  const {
    isOpen: isConfirmDialogOpen,
    openModal: openConfirmDialog,
    closeModal: closeConfirmDialog,
  } = useModal();
  const loading = useActiveThreatsStore((state) => state.loading);
  const list = useActiveThreatsStore((state) => state.list);
  const monitoredThreatsFilters = useAttackChainsStore((state) => state.filters?.monitored_threats);
  const fetchList = useActiveThreatsStore((state) => state.fetchList);
  const bulkEnable = useActiveThreatsStore((state) => state.bulkEnable);
  const bulkDisable = useActiveThreatsStore((state) => state.bulkDisable);
  const correlationPipelines = useCorrelationPipelinesStore((state) => state.list);
  const fetchCorrelationPipelines = useCorrelationPipelinesStore((state) => state.fetchList);
  const { search, debouncedSearch, setSearch } = useSearch();
  const { page, limit, setPage, setLimit } = usePagination();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [filters, setFilters] = useState(initialFilters);
  const [currentThreat, setCurrentThreat] = useState<ActiveThreatListItem | undefined>(undefined);
  const [confirmAction, setConfirmAction] = useState<{
    mode: ConfirmMode;
    threatIds: string[];
  } | null>(null);
  const { sorting, handleSortingChange } = useSorting({ setPage });

  const buildFetchParams = useCallback((): ActiveThreatsParams => {
    const { sort, order } = convertSortingToApiParams(sorting);
    const params: ActiveThreatsParams = {
      offset: (page - 1) * limit,
      limit,
      search: debouncedSearch || undefined,
      sort: sort || 'release_date',
      order: order || OrderBy.DESC,
    };

    if (filters.pipeline !== 'all') {
      params.correlation_pipeline_id = filters.pipeline;
    }
    if (filters.severity !== 'all') {
      params.severity = [filters.severity];
    }
    if (filters.industry !== 'all') {
      params.industries = [filters.industry];
    }
    if (filters.threatType !== 'all') {
      params.threat_type = [filters.threatType];
    }
    if (filters.region !== 'all') {
      params.regions = [filters.region];
    }

    return params;
  }, [page, limit, debouncedSearch, filters, sorting]);

  useEffect(() => {
    fetchList(buildFetchParams());
  }, [buildFetchParams, fetchList]);

  useEffect(() => {
    fetchCorrelationPipelines({ limit: CORRELATION_PIPELINES_LIMIT }, false);
  }, [fetchCorrelationPipelines]);

  const correlationPipelineOptions = useMemo(
    () => (correlationPipelines?.data ?? []).map(({ id, name }) => ({ label: name, value: id })),
    [correlationPipelines],
  );

  const filterSelectOptions = useMemo(
    () => ({
      pipeline: withAllOption('All Correlation Pipelines', correlationPipelineOptions),
      severity: withAllOption(
        'All Severities',
        stringsToSelectOptions(monitoredThreatsFilters?.severity),
      ),
      industry: withAllOption(
        'All Industries',
        stringsToSelectOptions(monitoredThreatsFilters?.industry),
      ),
      threatType: withAllOption(
        'All Threat Types',
        stringsToSelectOptions(monitoredThreatsFilters?.threatType),
      ),
      region: withAllOption('All Regions', stringsToSelectOptions(monitoredThreatsFilters?.region)),
    }),
    [monitoredThreatsFilters, correlationPipelineOptions],
  );

  const handleFilterChange = useCallback(
    (value: string, filter: keyof typeof filters) => {
      setFilters((prev) => ({ ...prev, [filter]: value }));
      setPage(1);
    },
    [setPage],
  );

  const totalPages = useMemo(() => {
    if (!list) return 1;
    return Math.max(1, Math.ceil(list.total / limit));
  }, [list, limit]);

  const data = useMemo(() => list?.data ?? [], [list]);

  const handleCloseConfirmDialog = useCallback(() => {
    setConfirmAction(null);
    closeConfirmDialog();
  }, [closeConfirmDialog]);

  const handleOpenConfirmDialog = useCallback(
    (selectedIds: string[], mode: ConfirmMode) => {
      if (!correlationPipelines?.data.length) {
        toast.error('No correlation pipelines available');
        return;
      }
      setConfirmAction({ mode, threatIds: selectedIds });
      openConfirmDialog();
    },
    [correlationPipelines, openConfirmDialog],
  );

  const handleDialogConfirm = useCallback(
    async (pipelineIds: string[]) => {
      if (!confirmAction) return;
      const { mode, threatIds } = confirmAction;
      const bulkAction = mode === 'enable' ? bulkEnable : bulkDisable;
      try {
        await bulkAction({ threat_ids: threatIds, correlation_pipeline_ids: pipelineIds }, false);
        handleCloseConfirmDialog();
        setRowSelection({});
        fetchList(buildFetchParams(), false);
      } catch (error) {
        toast.error(`Failed to ${mode} threats`);
        console.error(`Failed to ${mode} threats:`, error);
      }
    },
    [confirmAction, bulkEnable, bulkDisable, handleCloseConfirmDialog, fetchList, buildFetchParams],
  );

  const handleOpenThreatDialog = useCallback(
    (threat: ActiveThreatListItem) => {
      setCurrentThreat(threat);
      openModal();
    },
    [openModal],
  );

  const returnTo = useReturnTo();
  const tableColumns = useMemo(
    () => columns({ onOpenThreatDialog: handleOpenThreatDialog, returnTo }),
    [handleOpenThreatDialog, returnTo],
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { rowSelection, sorting },
    manualPagination: true,
    autoResetPageIndex: false,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.tdm_id,
    onSortingChange: handleSortingChange,
  });

  return {
    loading,
    isOpen,
    currentThreat,
    table,
    tableColumns,
    data,
    rowSelection,
    page,
    limit,
    totalPages,
    search,
    filters,
    filterSelectOptions,
    isConfirmDialogOpen,
    confirmAction,
    correlationPipelines,
    correlationPipelineOptions,
    toggleModal,
    setSearch,
    setPage,
    setLimit,
    handleFilterChange,
    handleCloseConfirmDialog,
    handleOpenConfirmDialog,
    handleDialogConfirm,
  };
};
