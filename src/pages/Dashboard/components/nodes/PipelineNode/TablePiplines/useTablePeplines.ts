import { useDashboardStore } from '@/store/dashboard';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { columns } from './columns';

export const useTablePeplines = () => {
  const dashboardData = useDashboardStore((state) => state.dashboardData);
  const loading = useDashboardStore((state) => state.loading);
  const tablePiplinesOpen = useDashboardStore((state) => state.tablePiplinesOpen);
  const setTablePiplinesOpen = useDashboardStore((state) => state.setTablePiplinesOpen);

  const onClose = () => {
    setTablePiplinesOpen(false);
  };

  const table = useReactTable({
    data: dashboardData?.pipelines_stats || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: false,
    enableSorting: false,
    manualSorting: false,
  });

  return {
    table,
    columns,
    tablePiplinesOpen,
    loading,
    onClose,
  };
};
