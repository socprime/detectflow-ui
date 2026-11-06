import { useFilterRuleTab } from './useFilterRulTab';

import { PaginationWrap, TableWrap } from '@socprime/react-ui';

interface FilterRuleTabProps {
  search: string;
}

export const FilterRuleTab: React.FC<FilterRuleTabProps> = ({ search }) => {
  const { table, columns, loading, page, limit, totalPages, setPage, setLimit } =
    useFilterRuleTab(search);

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
