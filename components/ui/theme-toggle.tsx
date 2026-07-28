'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-surface-card border border-border flex items-center justify-center opacity-50" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-8 h-8 rounded-full bg-surface-card border border-border flex items-center justify-center text-text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs active:scale-95 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className={`transition-transform duration-500 flex items-center justify-center absolute inset-0 ${isDark ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <Sun size={14} className="group-hover:text-amber-500 transition-colors" />
      </div>
      <div className={`transition-transform duration-500 flex items-center justify-center absolute inset-0 ${isDark ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
        <Moon size={14} className="group-hover:text-blue-400 transition-colors" />
      </div>
    </button>
  );
}
