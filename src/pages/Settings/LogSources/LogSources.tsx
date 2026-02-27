import { Button } from '@/components/Button';
import { ConditionalContent } from '@/components/ConditionalContent';
import { SearchInput } from '@/components/Form/SearchInput';
import { Skeleton } from '@/components/Loading/Skeleton';
import { PageHeader } from '@/components/PageHeader';
import { PaginationWrap } from '@/components/Pagination';
import { routes } from '@/models/router';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { LogSourcesCard } from './LogSourcesCard';
import { LogSourcesEmptyState } from './LogSourcesEmptyState';
import { useLogSources } from './useLogSources';

export const LogSources: React.FC = () => {
  const { loading, search, logSources, page, limit, totalPages, setPage, setSearch, setLimit } =
    useLogSources();

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <PageHeader title="Log Sources" description="Configure custom log source definitions">
        <>
          <SearchInput
            id="search-log-sources"
            name="search-log-sources"
            className="w-64 text-xs"
            classNamesInput="h-10"
            value={search}
            onChange={setSearch}
            placeholder="Search log sources..."
          />
          <Button
            className="text-xs"
            size="l"
            to={routes.settingsLogSourcesCreate}
            variant="primary"
          >
            <PlusIcon className="size-4" />
            New Log Source
          </Button>
        </>
      </PageHeader>
      <ConditionalContent
        loading={loading}
        loadingContent={
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton className="h-24 w-full" key={index} />
            ))}
          </div>
        }
        loadedContent={
          logSources?.length > 0 ? (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
                {logSources?.map((logSource) => (
                  <LogSourcesCard className="flex-1" logSource={logSource} key={logSource.id} />
                ))}
              </div>
              <PaginationWrap
                page={page}
                totalPages={totalPages}
                limit={limit}
                setLimit={setLimit}
                onPageChange={setPage}
              />
            </>
          ) : (
            <LogSourcesEmptyState />
          )
        }
      />
    </div>
  );
};
