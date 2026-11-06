import type { AttackChainsGroupBy } from '@/models/providers';
import type {
  AttackChainListItem,
  AttackChainsResponse,
} from '@/models/providers/Types/responses/attackChains';

export const getFlatListItems = (response: AttackChainsResponse | null): AttackChainListItem[] => {
  if (!response) {
    return [];
  }

  if (response.data?.length) {
    return response.data;
  }

  if (response.groups) {
    return Object.values(response.groups).flat();
  }

  return [];
};

export const getServerGroups = (
  response: AttackChainsResponse | null,
): [string, AttackChainListItem[]][] => {
  if (!response?.groups) {
    return [];
  }

  return Object.entries(response.groups);
};

export const isServerGroupedView = (
  groupBy: AttackChainsGroupBy,
  response: AttackChainsResponse | null,
): boolean => {
  if (groupBy === 'none' || !response) {
    return false;
  }

  return Object.keys(response.groups ?? {}).length > 0;
};
