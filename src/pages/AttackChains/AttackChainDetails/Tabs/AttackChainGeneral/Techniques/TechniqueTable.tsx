import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { createTechniqueRuleColumns } from './columns';

import { TechniqueRule } from '@/models/providers/Types';
import { TableWrap } from '@socprime/react-ui';

interface TechniqueTableProps {
  rules: TechniqueRule[];
  columns: ReturnType<typeof createTechniqueRuleColumns>;
}

export const TechniqueTable: React.FC<TechniqueTableProps> = ({ rules, columns }) => {
  const table = useReactTable({
    data: rules,
    columns,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.sigma_rule_id ?? row.rule_name,
  });

  return <TableWrap className="rounded-t-none border-none" table={table} columns={columns} />;
};
