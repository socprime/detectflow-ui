import { SortingState } from '@tanstack/react-table';

import { OrderBy } from '@/models/providers';

export const convertSortingToApiParams = (sorting: SortingState) => {
  if (sorting.length === 0) {
    return { sort: undefined, order: undefined };
  }

  const firstSort = sorting[0];
  return {
    sort: firstSort.id,
    order: firstSort.desc ? OrderBy.DESC : OrderBy.ASC,
  };
};

export const convertApiParamsToSorting = (sort?: string, order?: OrderBy): SortingState => {
  if (!sort) {
    return [];
  }

  return [
    {
      id: sort,
      desc: order === OrderBy.DESC,
    },
  ];
};
