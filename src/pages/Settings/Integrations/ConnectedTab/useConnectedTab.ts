import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INTEGRATION_FILTER_ALL } from '../constants';
import { createColumns } from './columns';

import { usePagination } from '@/hooks/usePagination';
import { usePermissions } from '@/hooks/usePermissions';
import { useReturnTo } from '@/hooks/useReturnTo';
import { OrderBy } from '@/models/providers';
import { useIntegrationsStore } from '@/store';

export const useConnectedTab = () => {
  const { isViewer } = usePermissions();
  const returnTo = useReturnTo();
  const [searchParams] = useSearchParams();
  const selectedFilter = searchParams.get('category') ?? INTEGRATION_FILTER_ALL;
  const connectedIntegrations = useIntegrationsStore((state) => state.connectedIntegrations);
  const loading = useIntegrationsStore((state) => state.loading);
  const fetchConnectedIntegrations = useIntegrationsStore(
    (state) => state.fetchConnectedIntegrations,
  );
  const data = useMemo(() => connectedIntegrations?.data || [], [connectedIntegrations?.data]);
  const { page, limit, setPage, setLimit } = usePagination();
  const totalPages = useMemo(
    () => Math.ceil((connectedIntegrations?.total ?? 0) / limit),
    [connectedIntegrations?.total, limit],
  );

  useEffect(() => {
    const params = {
      offset: (page - 1) * limit,
      limit,
      sort: 'created',
      order: OrderBy.DESC,
      ...(selectedFilter !== INTEGRATION_FILTER_ALL ? { category: selectedFilter } : {}),
    };
    fetchConnectedIntegrations(params);
  }, [page, limit, selectedFilter, fetchConnectedIntegrations]);

  const columns = useMemo(() => createColumns({ isViewer, returnTo }), [isViewer, returnTo]);

  const table = useReactTable({
    data,
    columns,
    enableSorting: false,
    manualSorting: false,
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    loading,
    data,
    table,
    columns,
    page,
    totalPages,
    limit,
    setPage,
    setLimit,
  };
};
