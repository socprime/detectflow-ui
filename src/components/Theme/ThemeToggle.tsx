import { useThemeStore } from '@/store/theme';
import { Button } from '../Button';

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <Button
      onClick={() => setTheme(next)}
      className="btn btn--secondary px-4"
      aria-label="Toggle theme"
      variant="secondaryOutline"
    >
      <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
      <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </Button>
  );
}
