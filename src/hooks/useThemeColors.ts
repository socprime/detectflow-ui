import { useThemeStore } from '@/store/theme';
import { useEffect, useRef, useState } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  lightBlue: string;
  purple: string;
  default: string;
  subdued: string;
  warning: string;
  critical: string;
}

const defaultColors: ThemeColors = {
  primary: '',
  secondary: '',
  success: '',
  lightBlue: '',
  purple: '',
  default: '',
  subdued: '',
  warning: '',
  critical: '',
};

export function useThemeColors() {
  const theme = useThemeStore((state) => state.theme);
  const [colors, setColors] = useState<ThemeColors>(defaultColors);
  const prevThemeRef = useRef(theme);

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      const newColors: ThemeColors = {
        primary: styles.getPropertyValue('--bg-primary').trim(),
        secondary: styles.getPropertyValue('--bg-secondary').trim(),
        success: styles.getPropertyValue('--bg-success').trim(),
        lightBlue: styles.getPropertyValue('--bg-light-blue').trim(),
        purple: styles.getPropertyValue('--bg-purple').trim(),
        default: styles.getPropertyValue('--text-default').trim(),
        subdued: styles.getPropertyValue('--text-subdued').trim(),
        warning: styles.getPropertyValue('--text-warning').trim(),
        critical: styles.getPropertyValue('--text-critical').trim(),
      };

      setColors((prev) => {
        if (
          prev.primary === newColors.primary &&
          prev.secondary === newColors.secondary &&
          prev.success === newColors.success &&
          prev.lightBlue === newColors.lightBlue &&
          prev.purple === newColors.purple &&
          prev.default === newColors.default &&
          prev.subdued === newColors.subdued &&
          prev.warning === newColors.warning &&
          prev.critical === newColors.critical
        ) {
          return prev;
        }
        return newColors;
      });
    };

    updateColors();

    const timer = setTimeout(updateColors, 50);
    prevThemeRef.current = theme;

    return () => clearTimeout(timer);
  }, [theme]);

  return colors;
}
