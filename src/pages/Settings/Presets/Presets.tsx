import { PlusIcon } from 'lucide-react';
import React from 'react';
import { usePresets } from './usePresets';

import { routes } from '@/models/router';
import { Button, PageHeader, PaginationWrap, SearchInput, TableWrap } from '@socprime/react-ui';

export const Presets: React.FC = () => {
  const { loading, search, table, page, limit, columns, totalPages, setSearch, setPage, setLimit } =
    usePresets();

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <PageHeader title="Presets" description="Manage deployment presets for different platforms">
        <>
          <SearchInput
            id="search-presets"
            name="search-presets"
            className="w-64 text-xs"
            classNamesInput="h-10"
            value={search}
            onChange={setSearch}
            placeholder="Search presets..."
          />
          <Button className="text-xs" size="l" to={routes.settingsPresetCreate} variant="primary">
            <PlusIcon className="size-4" />
            New Preset
          </Button>
        </>
      </PageHeader>
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
