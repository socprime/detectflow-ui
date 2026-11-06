import { useSearchParams } from 'react-router-dom';

import { RETURN_TO_PARAM } from '@/utils';

const isInternalPath = (path: string): boolean => path.startsWith('/') && !path.startsWith('//');

interface UseReturnLinkOptions {
  /** URL used when 'returnTo' is absent (user opened the page directly) */
  fallback: string;
}

export const useReturnLink = ({ fallback }: UseReturnLinkOptions): string => {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get(RETURN_TO_PARAM);

  return returnTo && isInternalPath(returnTo) ? returnTo : fallback;
};
