import type { FilterOption } from '@/models/providers/Types/responses/attackChains';

export const stringsToSelectOptions = (items: string[] = []) =>
  items.map((item) => ({ label: item, value: item }));

export const withAllOption = <T extends FilterOption>(
  allLabel: string,
  items: T[] = [],
  allValue = 'all',
): T[] => [{ label: allLabel, value: allValue } as T, ...items];
