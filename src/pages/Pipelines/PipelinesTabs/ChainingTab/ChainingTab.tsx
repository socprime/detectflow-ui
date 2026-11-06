import { PlusIcon } from 'lucide-react';
import { useChainingTab } from './useChainingTab';

import { routes } from '@/models/router';
import { Button, PaginationWrap, SearchInput, TableWrap } from '@socprime/react-ui';

export const ChainingTab = () => {
  const {
    search,
    table,
    columns,
    data,
    loading,
    page,
    totalPages,
    limit,
    setLimit,
    setPage,
    setSearch,
  } = useChainingTab();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput
          id="search-chaining-pipelines"
          name="search-chaining-pipelines"
          className="w-full max-w-sm text-xs"
          classNamesInput="h-10"
          placeholder="Search..."
          value={search}
          onChange={setSearch}
        />
        <Button className="text-xs" size="l" variant="primary" to={routes.chainingCreate}>
          <PlusIcon className="size-4" />
          New Chaining Pipeline
        </Button>
      </div>
      <TableWrap
        table={table}
        columns={columns}
        data={data}
        loading={loading}
        classNameHeader="px-3"
        classNameCell="px-3"
      />
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
