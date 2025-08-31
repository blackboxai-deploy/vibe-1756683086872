'use client';

import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '🖥️'; // system
  };

  const getLabel = () => {
    if (theme === 'light') return 'Claro';
    if (theme === 'dark') return 'Oscuro';
    return 'Sistema';
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="gap-2"
      title={`Cambiar tema (actual: ${getLabel()})`}
    >
      {getIcon()} {getLabel()}
    </Button>
  );
}