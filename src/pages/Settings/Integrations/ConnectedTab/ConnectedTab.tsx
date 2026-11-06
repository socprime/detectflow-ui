import { Filters } from '../Filters';
import { useConnectedTab } from './useConnectedTab';

import { PaginationWrap, TableWrap } from '@socprime/react-ui';

export const ConnectedTab = () => {
  const { table, loading, data, columns, page, totalPages, limit, setLimit, setPage } =
    useConnectedTab();

  return (
    <div className="flex flex-col gap-6">
      <Filters />
      <TableWrap table={table} columns={columns} data={data} loading={loading} />
      <PaginationWrap
        page={page}
        totalPages={totalPages}
        limit={limit}
        setLimit={setLimit}
        onPageChange={setPage}
      />
    </div>
  );
};
