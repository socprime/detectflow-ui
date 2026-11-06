import { useFilterPipelineTab } from './useFilterPipelineTab';

import { PaginationWrap, TableWrap } from '@socprime/react-ui';

interface FilterPipelineTabProps {
  search: string;
}

export const FilterPipelineTab: React.FC<FilterPipelineTabProps> = ({ search }) => {
  const { table, columns, loading, page, limit, totalPages, setPage, setLimit } =
    useFilterPipelineTab(search);

  return (
    <div className="flex flex-col gap-6">
      <TableWrap table={table} columns={columns} loading={loading} />
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
