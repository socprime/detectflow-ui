import { PlusIcon } from 'lucide-react';
import { FilterPipelineTab } from './FilterPipelineTab';
import { FilterTypes } from './useFilters';

import { useSearch } from '@/hooks';
import { routeHelpers } from '@/models/router';
import { Button, PageHeader, SearchInput } from '@socprime/react-ui';

export const Filters: React.FC = () => {
  const { search, debouncedSearch, setSearch } = useSearch();

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <PageHeader title="Filters" description="Manage and configure detection filters">
        <SearchInput
          id="search-filters"
          name="search-filters"
          className="w-64 text-xs"
          classNamesInput="h-10"
          value={search}
          onChange={setSearch}
          placeholder="Search filters..."
        />
        <Button
          className="text-xs"
          size="l"
          to={routeHelpers.settingsFilterCreate(FilterTypes.Pipeline)}
          variant="primary"
        >
          <PlusIcon className="size-4" />
          New Filter
        </Button>
      </PageHeader>
      <FilterPipelineTab search={debouncedSearch} />
    </div>
  );
};
