import { formatDate } from '@/utils';

export const formatTimestamp = (date: Date): string => {
  return formatDate(date, 'full');
};
