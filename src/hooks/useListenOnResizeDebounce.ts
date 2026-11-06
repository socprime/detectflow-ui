import { useEffect } from 'react';

export const useListenOnResizeDebounce = (handleResize: () => void) => {
  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const debouncedResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(handleResize, 200);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);

      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, [handleResize]);
};
