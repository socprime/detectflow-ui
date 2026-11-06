import { RefObject, useCallback, useEffect, useState } from 'react';

interface UseFullscreenReturn {
  isFullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
}

export function useFullscreen(
  element: RefObject<HTMLElement>,
  onFullscreenChange?: (isFullscreen: boolean) => void,
): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleFullscreenChange = useCallback(() => {
    const { fullscreenElement } = document;
    const isCurrentlyFullscreen = !!fullscreenElement;
    setIsFullscreen(isCurrentlyFullscreen);

    if (onFullscreenChange) {
      onFullscreenChange(isCurrentlyFullscreen);
    }
  }, [onFullscreenChange]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const enterFullscreen = useCallback(async (): Promise<void> => {
    if (!element.current) {
      return;
    }

    try {
      await element.current.requestFullscreen();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const exitFullscreen = useCallback(async (): Promise<void> => {
    if (!document.fullscreenElement) {
      return;
    }

    try {
      await document.exitFullscreen();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const toggleFullscreen = useCallback(async (): Promise<void> => {
    if (document.fullscreenElement) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
}
