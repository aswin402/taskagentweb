import { Moon, Sun} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import Button from './button';


export function ThemeToggleButton() {
  const { theme, setTheme } = useThemeStore();

  // Resolve system theme to actual active theme
  const activeTheme = theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  const toggleTheme = () => {
    setTheme(activeTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={`Current: ${theme} • Click to toggle`}
      className="fixed top-4 right-4 h-10 w-10 rounded-full"
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          activeTheme === 'light'
            ? 'rotate-0 scale-100'
            : 'rotate-90 scale-0'
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          activeTheme === 'dark'
            ? 'rotate-0 scale-100'
            : 'rotate-90 scale-0'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}