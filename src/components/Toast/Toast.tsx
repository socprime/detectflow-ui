import { useThemeStore } from '@/store/theme';
import { Toaster as Sonner, ToasterProps } from 'sonner';

export const Toaster: React.FC<ToasterProps> = ({ ...props }) => {
  const theme = useThemeStore((s) => s.theme);

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      expand
      style={
        {
          '--normal-bg': 'var(--bg-secondary)',
          '--normal-text': 'var(--text-default)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};
