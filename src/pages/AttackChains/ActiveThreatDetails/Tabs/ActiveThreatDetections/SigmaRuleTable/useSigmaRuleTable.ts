import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { createSigmaRuleTableColumns } from './columns';

import { useReturnTo } from '@/hooks';
import type { ActiveThreatHighOrderSigma } from '@/models/providers/Types/responses/activeThreats';

interface UseSigmaRuleTableProps {
  data?: ActiveThreatHighOrderSigma[];
  activeThreatId?: string;
}

export const useSigmaRuleTable = ({ data = [], activeThreatId }: UseSigmaRuleTableProps) => {
  const returnTo = useReturnTo();

  const columns = useMemo(
    () => createSigmaRuleTableColumns(activeThreatId, returnTo),
    [activeThreatId, returnTo],
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
