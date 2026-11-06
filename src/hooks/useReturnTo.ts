import { useLocation } from 'react-router-dom';

export const useReturnTo = (): string => {
  const { pathname, search } = useLocation();

  return `${pathname}${search}`;
};
