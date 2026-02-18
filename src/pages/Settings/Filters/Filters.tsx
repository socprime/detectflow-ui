import { Button } from '@/components/Button';
import { SearchInput } from '@/components/Form';
import { PageHeader } from '@/components/PageHeader';
import { PaginationWrap } from '@/components/Pagination';
import { TableWrap } from '@/components/Table';
import { routes } from '@/models/router';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { useFilters } from './useFilter';

export const Filters: React.FC = () => {
  const { loading, search, table, page, columns, totalPages, setSearch, setPage } = useFilters();

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <PageHeader title="Filters" description="Manage and configure detection filters">
        <>
          <SearchInput
            id="search-filters"
            name="search-filters"
            className="w-64 text-xs"
            classNamesInput="h-10"
            value={search}
            onChange={setSearch}
            placeholder="Search filters..."
          />
          <Button className="text-xs" size="l" to={routes.settingsFilterCreate} variant="primary">
            <PlusIcon className="size-4" />
            New Filter
          </Button>
        </>
      </PageHeader>
      <TableWrap table={table} columns={columns} loading={loading} />
      <PaginationWrap page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};
