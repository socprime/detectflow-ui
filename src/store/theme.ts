import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  root.setAttribute('data-theme', theme);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => {
      const defaultTheme: Theme = 'dark';

      if (typeof window !== 'undefined') {
        applyTheme(defaultTheme);
      }

      return {
        theme: defaultTheme,
        setTheme: (theme) => {
          set({ theme });
          applyTheme(theme);
        },
      };
    },
    {
      name: 'theme',
      onRehydrateStorage: () => (state) => {
        const theme = state?.theme || 'dark';
        if (typeof window !== 'undefined') {
          applyTheme(theme);
        }
        if (state && !state.theme) {
          state.theme = 'dark';
        }
      },
    },
  ),
);
