import { Button } from '@/components/Button';
import { SearchInput } from '@/components/Form/SearchInput';
import { PageHeader } from '@/components/PageHeader';
import { PaginationWrap } from '@/components/Pagination';
import { TableWrap } from '@/components/Table';
import { routes } from '@/models/router/routes';
import { PlusIcon } from 'lucide-react';
import { usePipelines } from './usePipelines';

export const Pipelines: React.FC = () => {
  const {
    search,
    loading,
    table,
    data,
    page,
    limit,
    totalPages,
    columns,
    setPage,
    setSearch,
    setLimit,
  } = usePipelines();

  return (
    <section className="flex w-full flex-col gap-6 p-6">
      <PageHeader title="Pipelines" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput
          id="search-pipelines"
          name="search-pipelines"
          className="w-64 text-xs"
          classNamesInput="h-10"
          placeholder="Search pipelines..."
          value={search}
          onChange={setSearch}
        />
        <Button className="text-xs" size="l" variant="primary" to={routes.pipelineCreate}>
          <PlusIcon className="size-4" />
          New Pipeline
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
    </section>
  );
};
