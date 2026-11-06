import { FC } from 'react';
import { useFilters } from './useFilters';

import { Badge } from '@socprime/react-ui';

export const Filters: FC = () => {
  const { data, selectedFilter, handleFilterChange } = useFilters();

  return (
    <div className="flex flex-wrap gap-2">
      {data?.map((filter) => (
        <Badge
          className="cursor-pointer rounded-full px-3 py-1 text-xs"
          key={filter.value}
          variant={selectedFilter === filter.value ? 'success' : 'defaultOutline'}
          onClick={() => handleFilterChange(filter.value)}
        >
          {filter.label}
        </Badge>
      ))}
    </div>
  );
};
