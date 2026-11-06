import { RepositoriesEmptyState } from '../RepositoriesEmptyState';
import { useHOSRules } from './useHOSRules';

import { PageHeader, PaginationWrap, SearchInput, TableWrap } from '@socprime/react-ui';

export const HOSRules = () => {
  const {
    loading,
    page,
    total,
    table,
    columns,
    search,
    totalPages,
    limit,
    setSearch,
    setPage,
    setLimit,
  } = useHOSRules();

  const headerDescription = `${total} detection rules`;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title={'Higher Order Sigma Rules'}
        description={headerDescription}
        descriptionSize="sm"
      >
        <SearchInput
          id="search-hos"
          name="search-hos"
          className="w-64 text-xs"
          classNamesInput="h-10"
          value={search}
          onChange={setSearch}
          placeholder="Search rules..."
        />
      </PageHeader>
      <TableWrap
        table={table}
        columns={columns}
        loading={loading}
        emptyContent={<RepositoriesEmptyState loading={loading} />}
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
