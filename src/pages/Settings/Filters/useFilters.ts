import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { updateQueryParams } from '@/utils';

export enum FilterTypes {
  Pipeline = 'for_pipeline',
  Rule = 'for_rule',
}

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterType = searchParams.get('type');
  const isValidFilterType = filterType === FilterTypes.Pipeline;
  const selectedTab = FilterTypes.Pipeline;

  useEffect(() => {
    if (isValidFilterType) {
      return;
    }

    setSearchParams((prev) => updateQueryParams(prev, { type: FilterTypes.Pipeline }), {
      replace: true,
    });
  }, [filterType, isValidFilterType, setSearchParams]);

  const handleTabChange = (value: string) => {
    setSearchParams((prev) =>
      updateQueryParams(prev, {
        type: FilterTypes.Pipeline,
        page: '1',
      }),
    );
  };
  return {
    selectedTab,
    handleTabChange,
  };
};
