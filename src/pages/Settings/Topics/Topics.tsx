import { RefreshCwIcon } from 'lucide-react';
import React, { memo } from 'react';
import { useTopics } from './useTopics';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks/usePermissions';
import { Button, PageHeader, PaginationWrap, SearchInput, TableWrap } from '@socprime/react-ui';

export const Topics: React.FC = memo(() => {
  const {
    loading,
    table,
    columns,
    page,
    limit,
    topicsData,
    totalPages,
    search,
    setPage,
    setLimit,
    setSearch,
    handleSyncTopics,
  } = useTopics();

  const { isViewer } = usePermissions();

  return (
    <section className="flex w-full flex-col gap-6">
      <PageHeader title="Topics" description="Manage Kafka topics for pipeline configuration">
        <>
          <SearchInput
            id="search-topics"
            name="search-topics"
            className="w-64 text-xs"
            classNamesInput="h-10"
            value={search}
            onChange={setSearch}
            placeholder="Search topics..."
          />
          <DisabledTooltip disabled={isViewer}>
            <Button
              className="text-xs"
              size="l"
              variant="secondaryOutline"
              onClick={handleSyncTopics}
              loading={loading}
              disabled={isViewer}
            >
              <RefreshCwIcon className="size-4" />
              Sync Topics
            </Button>
          </DisabledTooltip>
        </>
      </PageHeader>
      <TableWrap table={table} columns={columns} loading={loading} data={topicsData} />
      <PaginationWrap
        page={page}
        totalPages={totalPages}
        limit={limit}
        setLimit={setLimit}
        onPageChange={setPage}
      />
    </section>
  );
});
