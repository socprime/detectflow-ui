import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { createDetectionsTableColumns } from './columns';
import { DetectionsTableProps } from './DetectionsTable';

import { useReturnTo } from '@/hooks';

export const useDetectionsTable = ({
  data = [],
  activeThreatId,
  ruleCheckResults,
}: DetectionsTableProps) => {
  const returnTo = useReturnTo();

  const columns = useMemo(
    () => createDetectionsTableColumns(activeThreatId, ruleCheckResults, returnTo),
    [activeThreatId, ruleCheckResults, returnTo],
  );

  const table = useReactTable({
    data,
    columns,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  return {
    table,
    columns,
  };
};
