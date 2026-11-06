import { useTablePeplines } from './useTablePeplines';

import { DefaultDialog, TableWrap } from '@socprime/react-ui';

export const TablePiplines = () => {
  const { table, columns, tablePiplinesOpen, loading, onClose } = useTablePeplines();

  return (
    <DefaultDialog
      className="sm:max-w-[1200px]"
      isOpen={tablePiplinesOpen}
      onClose={onClose}
      title="Active Pipelines"
      children={
        <TableWrap
          classNameScrollArea="max-h-[calc(100vh-300px)] "
          table={table}
          columns={columns}
          loading={loading}
        />
      }
    />
  );
};
