import { Button } from '@/components/Button';
import { SearchInput } from '@/components/Form/SearchInput';
import { PageHeader } from '@/components/PageHeader';
import { PaginationWrap } from '@/components/Pagination';
import { TableWrap } from '@/components/Table';
import { RefreshCwIcon } from 'lucide-react';
import React, { memo } from 'react';
import { useTopics } from './useTopics';

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
          <Button
            className="text-xs"
            size="l"
            variant="secondaryOutline"
            onClick={handleSyncTopics}
            loading={loading}
          >
            <RefreshCwIcon className="size-4" />
            Sync Topics
          </Button>
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
