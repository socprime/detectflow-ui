import { SortingState } from '@tanstack/react-table';

export const convertSortingToApiParams = (sorting: SortingState) => {
  if (sorting.length === 0) {
    return { sort: undefined, order: undefined };
  }

  const firstSort = sorting[0];
  return {
    sort: firstSort.id,
    order: firstSort.desc ? ('desc' as const) : ('asc' as const),
  };
};

export const convertApiParamsToSorting = (sort?: string, order?: 'asc' | 'desc'): SortingState => {
  if (!sort) {
    return [];
  }

  return [
    {
      id: sort,
      desc: order === 'desc',
    },
  ];
};
